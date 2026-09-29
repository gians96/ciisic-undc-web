# Documentación de ciisic-undc-web

Landing del congreso CIISIC (una por edición/evento). Empieza por aquí:

| Necesito… | Documento |
|---|---|
| Entender cómo habla con el backend (BFF, token del evento, caché, Google) | [arquitectura.md](arquitectura.md) |
| El flujo de inscripción y confirmación | [INSCRIPCION-FLUJO.md](INSCRIPCION-FLUJO.md) |
| El registro de ponencias (papers) | [PAPERS-REGISTRO.md](PAPERS-REGISTRO.md) |
| Desplegar (variables, validación, rollback) | [DEPLOYMENT-HITO1.md](DEPLOYMENT-HITO1.md) |
| Contratos entre sistemas del ecosistema | `backend-ciisic/docs/arquitectura-ecosistema.md` |
| Contrato de la API del sitio que consume esta landing | `backend-ciisic/specs/007-tokens-acceso-evento/contracts/api-sitio.md` y [`../specs/001-landing-multi-evento/contracts/bff-landing.md`](../specs/001-landing-multi-evento/contracts/bff-landing.md) |

Especificaciones: [`../specs/`](../specs) · constitución:
[`../.specify/memory/constitution.md`](../.specify/memory/constitution.md) · guía para agentes:
[`../AGENTS.md`](../AGENTS.md).
