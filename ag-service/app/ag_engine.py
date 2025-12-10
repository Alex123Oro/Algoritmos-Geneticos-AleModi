from typing import List, Tuple
from datetime import datetime
import random
import numpy as np

from .schemas import FamiliaIn, SolicitudIn, AyudaOut, DetalleFitness


def calcular_balance(familias: List[FamiliaIn]) -> float:
    if not familias:
        return 0.0

    balances = np.array([f.horasDadas - f.horasRecibidas for f in familias], dtype=float)
    desvio = np.std(balances)
    score = 1.0 / (1.0 + desvio)
    return float(score)


def construir_plan_simple(
    familias: List[FamiliaIn],
    solicitudes: List[SolicitudIn],
) -> List[AyudaOut]:
    if not familias or not solicitudes:
        return []

    prioridad_urgencia = {"ALTA": 3, "MEDIA": 2, "BAJA": 1}

    solicitudes_ordenadas = sorted(
        solicitudes,
        key=lambda s: prioridad_urgencia.get(s.urgencia.upper(), 1),
        reverse=True,
    )

    familias_dict = {f.id: f for f in familias}

    ayudas: List[AyudaOut] = []

    for sol in solicitudes_ordenadas:
        familia_destino_id = sol.familiaId

        candidatas = [f for f in familias_dict.values() if f.id != familia_destino_id]
        if not candidatas:
            candidatas = [familias_dict[familia_destino_id]]

        candidatas = sorted(
            candidatas,
            key=lambda f: (f.horasRecibidas - f.horasDadas),
            reverse=True,
        )

        origen = candidatas[0]

        rango_mitad = sol.fechaInicio + (sol.fechaFin - sol.fechaInicio) / 2

        ayuda = AyudaOut(
            origenId=origen.id,
            destinoId=familia_destino_id,
            solicitudId=sol.id,
            tipo=sol.tipo,
            fecha=rango_mitad,
            horas=sol.horasEstimadas,
        )
        ayudas.append(ayuda)

        origen.horasDadas += sol.horasEstimadas

    return ayudas


def optimizar_ayni(
    familias: List[FamiliaIn],
    solicitudes: List[SolicitudIn],
    tamano_poblacion: int = 30,
    max_generaciones: int = 50,
) -> Tuple[List[AyudaOut], float, DetalleFitness]:
    ayudas = construir_plan_simple(familias, solicitudes)

    equilibrio = calcular_balance(familias)

    total_solicitudes = len(solicitudes)
    solicitudes_cubiertas = len({a.solicitudId for a in ayudas}) if ayudas else 0
    cobertura = (
        solicitudes_cubiertas / total_solicitudes if total_solicitudes > 0 else 0.0
    )

    horas_por_familia = {}
    for a in ayudas:
        horas_por_familia[a.origenId] = horas_por_familia.get(a.origenId, 0) + a.horas

    max_horas = max(horas_por_familia.values()) if horas_por_familia else 0
    total_horas = sum(horas_por_familia.values()) if horas_por_familia else 0

    if total_horas > 0:
        carga_maxima = 1.0 - (max_horas / total_horas)
    else:
        carga_maxima = 1.0

    fitness = float((equilibrio + cobertura + carga_maxima) / 3.0)

    detalle = DetalleFitness(
        equilibrioAyni=equilibrio,
        coberturaSolicitudes=cobertura,
        cargaMaximaPorFamilia=carga_maxima,
    )

    return ayudas, fitness, detalle
