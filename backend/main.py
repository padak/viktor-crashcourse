"""Life Coach App - FastAPI Backend."""

import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from llm import analyze_problems, get_recommendations

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Pydantic models
class AnalyzeRequest(BaseModel):
    """Request model for problem analysis."""

    feeling: str
    troubles: str
    changes: str


class Problem(BaseModel):
    """Model representing a single problem."""

    id: int
    title: str
    description: str


class AnalyzeResponse(BaseModel):
    """Response model for problem analysis."""

    problems: list[Problem]


class RecommendRequest(BaseModel):
    """Request model for recommendations."""

    problems: list[Problem]


class Recommendation(BaseModel):
    """Model representing a single recommendation."""

    problem_id: int
    advice: str


class RecommendResponse(BaseModel):
    """Response model for recommendations."""

    recommendations: list[Recommendation]

app = FastAPI(
    title="Life Coach App",
    description="AI-powered life coaching assistant",
    version="0.1.0",
)

# Configure CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "ok"}


@app.post("/api/analyze", response_model=AnalyzeResponse)
async def analyze(request: AnalyzeRequest) -> AnalyzeResponse:
    """Analyze user input and identify problems.

    Args:
        request: User's feelings, troubles, and desired changes.

    Returns:
        List of identified problems.

    Raises:
        HTTPException: If analysis fails.
    """
    try:
        logger.info("Analyzing problems for user input")
        problems = await analyze_problems(
            feeling=request.feeling,
            troubles=request.troubles,
            changes=request.changes,
        )
        return AnalyzeResponse(problems=problems)
    except ValueError as e:
        logger.error(f"Validation error during analysis: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error during problem analysis: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to analyze problems. Please try again later.",
        )


@app.post("/api/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest) -> RecommendResponse:
    """Get recommendations for identified problems.

    Args:
        request: List of problems to get recommendations for.

    Returns:
        List of recommendations for each problem.

    Raises:
        HTTPException: If recommendation generation fails.
    """
    try:
        logger.info(f"Getting recommendations for {len(request.problems)} problems")
        # Convert Pydantic models to dicts for LLM module
        problems_dicts = [p.model_dump() for p in request.problems]
        recommendations = await get_recommendations(problems=problems_dicts)
        return RecommendResponse(recommendations=recommendations)
    except ValueError as e:
        logger.error(f"Validation error during recommendation: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error during recommendation generation: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to generate recommendations. Please try again later.",
        )
