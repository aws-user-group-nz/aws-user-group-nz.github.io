import json
import urllib.error
import urllib.request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
import uvicorn
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse

LIVE_APIS = {
    "discord": "https://qhh1yazige.execute-api.ap-southeast-2.amazonaws.com",
    "twitch": "https://zfajs2uwoj.execute-api.ap-southeast-2.amazonaws.com",
    "youtube": "https://c2e8l3xxy5.execute-api.ap-southeast-2.amazonaws.com",
}

app = FastAPI()


class DevNoCacheMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        path = request.url.path
        if path.endswith(('.js', '.css', '.html')) or path.startswith('/content/'):
            response.headers['Cache-Control'] = 'no-store'
        return response


app.add_middleware(DevNoCacheMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/live/{source}")
async def proxy_live_api(source: str):
    url = LIVE_APIS.get(source)
    if not url:
        return JSONResponse(status_code=404, content={"error": f"Unknown source: {source}"})

    try:
        request = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=30) as response:
            data = json.loads(response.read().decode())
        return JSONResponse(content=data)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        try:
            payload = json.loads(body)
        except json.JSONDecodeError:
            payload = {"error": body or str(e)}
        return JSONResponse(status_code=e.code, content=payload)
    except Exception as e:
        return JSONResponse(status_code=502, content={"error": str(e)})


app.mount("/", StaticFiles(directory=".", html=True), name="static")

if __name__ == "__main__":
    print("Server starting at http://localhost:6969")
    print("Live API proxy: http://localhost:6969/api/live/{discord|twitch|youtube}")
    uvicorn.run(app, host="localhost", port=6969)
