from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .schemas import OptimizarAyniRequest, OptimizarAyniResponse
from .ag_engine import optimizar_ayni

app = FastAPI(
    title="AYNI-PLUS-AG - Servicio de Algoritmo Genético",
    version="0.1.0",
    description="Microservicio para optimizar planes de ayni usando Algoritmos Genéticos (versión inicial).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/optimizar-ayni", response_model=OptimizarAyniResponse)
def optimizar_ayni_endpoint(payload: OptimizarAyniRequest):
    familias = payload.familias
    solicitudes = payload.solicitudes
    parametros = payload.parametros or {}

    tamano = parametros.tamanoPoblacion if parametros else 30
    generaciones = parametros.maxGeneraciones if parametros else 50

    ayudas, fitness, detalle = optimizar_ayni(
        familias=familias,
        solicitudes=solicitudes,
        tamano_poblacion=tamano,
        max_generaciones=generaciones,
    )

    return OptimizarAyniResponse(
        ayudas=ayudas,
        fitness=fitness,
        detalleFitness=detalle,
    )
