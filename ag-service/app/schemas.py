from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime


class FamiliaIn(BaseModel):
    id: int
    nombre: str
    comunidadId: int
    miembros: int
    horasDadas: int
    horasRecibidas: int


class SolicitudIn(BaseModel):
    id: int
    familiaId: int
    tipo: str  # "SIEMBRA", "COSECHA", etc.
    horasEstimadas: int
    urgencia: str  # "BAJA", "MEDIA", "ALTA"
    fechaInicio: datetime
    fechaFin: datetime


class ParametrosAG(BaseModel):
    tamanoPoblacion: int = 30
    maxGeneraciones: int = 50


class OptimizarAyniRequest(BaseModel):
    familias: List[FamiliaIn]
    solicitudes: List[SolicitudIn]
    parametros: Optional[ParametrosAG] = None


class AyudaOut(BaseModel):
    origenId: int
    destinoId: int
    solicitudId: int
    tipo: str
    fecha: datetime
    horas: int


class DetalleFitness(BaseModel):
    equilibrioAyni: float
    coberturaSolicitudes: float
    cargaMaximaPorFamilia: float


class OptimizarAyniResponse(BaseModel):
    ayudas: List[AyudaOut]
    fitness: float
    detalleFitness: DetalleFitness
