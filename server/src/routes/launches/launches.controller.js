const { getAllLaunches, addDbLaunch, existLaunchWithId, abortLaunch } = require('../../models/launches.model');

const { getPagination } = require('../../services/query')

async function httpGetAllLaunches(req, resp) {
    const { limit, skip } = getPagination(req.query);
    return resp.status(200).json(await getAllLaunches(limit, skip));
}

async function httpAddLaunch(req, resp) {
    const launch = req.body;
    if (!launch.mission || !launch.rocket || !launch.target || !launch.launchDate) {
        return resp.status(400).json({ error: 'missing property required' });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return resp.status(400).json({ error: 'invalid date' });
    }

    await addDbLaunch(launch);
    resp.status(201).json(launch);

}

async function httpAbortLaunch(req, resp) {
    
    const launchId = Number(req.params.id);
    const exist = await existLaunchWithId(launchId)
    console.log(exist)
    if (!exist) {
        return resp.status(400).json({
            error: 'id not found'
        })
    } else {
        const aborted = await abortLaunch(launchId);
        if (!aborted){
            return resp.status(400).json({error: 'Launch not aborted'})
        }
        return resp.status(200).json({ok: true});
    }
}

module.exports = {
    httpGetAllLaunches,
    httpAddLaunch,
    httpAbortLaunch
}
