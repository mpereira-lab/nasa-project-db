const BASE_URL = 'v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
  const response = await fetch(`${BASE_URL}/planets`);
  return  await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
    const response = await fetch(`${BASE_URL}/launches`)
    return await response.json();
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
  try{
    return await fetch(`${BASE_URL}/launches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'},
        body: JSON.stringify(launch)
    });
  } catch (err){
    return {
      ok: false
    };
  }
}

async function httpAbortLaunch(id) {
  try{
    return await fetch(`${BASE_URL}/launches/${id}`,
      {
        method: 'DELETE'
      }
    )
  }catch (err){
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};