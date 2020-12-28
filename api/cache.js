const redis = require("redis");
const { promisify } = require("util");

const client = redis.createClient("redis://localhost:6379");
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

async function get(key) {
	const value = await getAsync(key).catch(console.error);
	if (!value) {
		return false;
	}
	return JSON.parse(value);
}

async function set(key, value, ttl) {
	// Always set a TTL and show a warning
	if (!ttl) {
		ttl = 3600;
		console.log(`[CACHE] No TTL set for: ${key}:${value}`);
	}
	return await setAsync(key, JSON.stringify(value), 'EX', ttl).catch(console.error);
}

module.exports = {
	get,
	set
};
