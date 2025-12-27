"""Tests for the FastAPI backend endpoints."""

import pytest
from httpx import ASGITransport, AsyncClient
from unittest.mock import AsyncMock, patch

from main import app


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test that health endpoint returns status ok."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_analyze_endpoint_success():
    """Test analyze endpoint with mocked LLM response."""
    mock_problems = [
        {"id": 1, "title": "Work Stress", "description": "Overwhelmed by workload"},
        {"id": 2, "title": "Sleep Issues", "description": "Difficulty falling asleep"},
        {"id": 3, "title": "Social Isolation", "description": "Lack of social connections"},
    ]

    with patch("main.analyze_problems", new_callable=AsyncMock) as mock_analyze:
        mock_analyze.return_value = mock_problems

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/analyze",
                json={
                    "feeling": "stressed and tired",
                    "troubles": "too much work, not enough sleep",
                    "changes": "better work-life balance",
                },
            )

        assert response.status_code == 200
        data = response.json()
        assert "problems" in data
        assert len(data["problems"]) == 3
        assert data["problems"][0]["title"] == "Work Stress"
        mock_analyze.assert_called_once_with(
            feeling="stressed and tired",
            troubles="too much work, not enough sleep",
            changes="better work-life balance",
        )


@pytest.mark.asyncio
async def test_analyze_endpoint_validation_error():
    """Test analyze endpoint returns 400 on ValueError."""
    with patch("main.analyze_problems", new_callable=AsyncMock) as mock_analyze:
        mock_analyze.side_effect = ValueError("Invalid input data")

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/analyze",
                json={
                    "feeling": "bad",
                    "troubles": "everything",
                    "changes": "something",
                },
            )

        assert response.status_code == 400
        assert "Invalid input data" in response.json()["detail"]


@pytest.mark.asyncio
async def test_analyze_endpoint_server_error():
    """Test analyze endpoint returns 500 on unexpected error."""
    with patch("main.analyze_problems", new_callable=AsyncMock) as mock_analyze:
        mock_analyze.side_effect = Exception("API connection failed")

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/analyze",
                json={
                    "feeling": "bad",
                    "troubles": "everything",
                    "changes": "something",
                },
            )

        assert response.status_code == 500
        assert "Failed to analyze problems" in response.json()["detail"]


@pytest.mark.asyncio
async def test_analyze_endpoint_missing_fields():
    """Test analyze endpoint returns 422 when required fields are missing."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        # Missing 'changes' field
        response = await client.post(
            "/api/analyze",
            json={
                "feeling": "stressed",
                "troubles": "work",
            },
        )

    assert response.status_code == 422
    error_detail = response.json()["detail"]
    assert any("changes" in str(err).lower() for err in error_detail)


@pytest.mark.asyncio
async def test_analyze_endpoint_empty_body():
    """Test analyze endpoint returns 422 with empty request body."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/analyze", json={})

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_recommend_endpoint_success():
    """Test recommend endpoint with mocked LLM response."""
    mock_recommendations = [
        {"problem_id": 1, "advice": "Take regular breaks during work"},
        {"problem_id": 2, "advice": "Establish a bedtime routine"},
        {"problem_id": 3, "advice": "Join a local community group"},
    ]

    input_problems = [
        {"id": 1, "title": "Work Stress", "description": "Overwhelmed by workload"},
        {"id": 2, "title": "Sleep Issues", "description": "Difficulty falling asleep"},
        {"id": 3, "title": "Social Isolation", "description": "Lack of social connections"},
    ]

    with patch("main.get_recommendations", new_callable=AsyncMock) as mock_recommend:
        mock_recommend.return_value = mock_recommendations

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/recommend",
                json={"problems": input_problems},
            )

        assert response.status_code == 200
        data = response.json()
        assert "recommendations" in data
        assert len(data["recommendations"]) == 3
        assert data["recommendations"][0]["advice"] == "Take regular breaks during work"


@pytest.mark.asyncio
async def test_recommend_endpoint_validation_error():
    """Test recommend endpoint returns 400 on ValueError."""
    with patch("main.get_recommendations", new_callable=AsyncMock) as mock_recommend:
        mock_recommend.side_effect = ValueError("Invalid problem format")

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/recommend",
                json={
                    "problems": [
                        {"id": 1, "title": "Test", "description": "Test desc"}
                    ]
                },
            )

        assert response.status_code == 400
        assert "Invalid problem format" in response.json()["detail"]


@pytest.mark.asyncio
async def test_recommend_endpoint_server_error():
    """Test recommend endpoint returns 500 on unexpected error."""
    with patch("main.get_recommendations", new_callable=AsyncMock) as mock_recommend:
        mock_recommend.side_effect = Exception("API connection failed")

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/recommend",
                json={
                    "problems": [
                        {"id": 1, "title": "Test", "description": "Test desc"}
                    ]
                },
            )

        assert response.status_code == 500
        assert "Failed to generate recommendations" in response.json()["detail"]


@pytest.mark.asyncio
async def test_recommend_endpoint_missing_problems():
    """Test recommend endpoint returns 422 when problems field is missing."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post("/api/recommend", json={})

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_recommend_endpoint_invalid_problem_structure():
    """Test recommend endpoint returns 422 for invalid problem structure."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as client:
        response = await client.post(
            "/api/recommend",
            json={
                "problems": [
                    {"id": 1, "title": "Missing description"}  # Missing 'description'
                ]
            },
        )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_recommend_endpoint_empty_problems_list():
    """Test recommend endpoint with empty problems list."""
    mock_recommendations: list = []

    with patch("main.get_recommendations", new_callable=AsyncMock) as mock_recommend:
        mock_recommend.return_value = mock_recommendations

        async with AsyncClient(
            transport=ASGITransport(app=app), base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/recommend",
                json={"problems": []},
            )

        assert response.status_code == 200
        data = response.json()
        assert data["recommendations"] == []
