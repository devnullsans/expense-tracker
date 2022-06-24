const unm = process.env.USERNAME;
const pwd = process.env.PASSWORD;

export default (authorization) => {
	const base64Credentials = authorization.split(' ')[1];
	const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
	const [username, password] = credentials.split(':');

	if (username === unm && password === pwd) {
		return true;
	}

	return false;
}