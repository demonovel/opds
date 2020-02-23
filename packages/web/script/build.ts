/**
 * Created by user on 2020/2/23.
 */
function lazy(m)
{
	return m.default || m
}

export default (async () => {

	console.log(process.env);

	await import('build-json-cache').then(lazy)

})();
