import React, { useState } from 'react';
import imgUnsplash from '../../lib/util/img/unsplash';

const ImgWithFallback = (prop) =>
{
	const [isUndefined, updateIsUndefined] = useState(false);
	const [src, updateSrc] = useState(prop.src);

	const onError = () =>
	{
		if (isUndefined)
		{

		}
		else
		{
			updateSrc(imgUnsplash());
			updateIsUndefined(true);
		}
	};

	return <img {...prop} src={src} onError={onError} />;
};

export default React.memo(ImgWithFallback, () => true);
