/**
 * Created by user on 2020/2/23.
 */
import removeZeroWidth from 'zero-width/lib';

export function handleSearchInput(input: string)
{
	return removeZeroWidth(input)
		.replace(/[.$\\\/(){}\[\]\-+*!?\s~「」【】、,…・。―〈〉『』—<>#·&=×:’'"@《》◆◇■□★▼＊☆◊＊◇§◆☆◊\*～\*＊＊↣◇★◆■□☆◊＝＝=══▼\-\=＝－─＊◇◆§☆◊\*─＝=══－\-─—\*＊＊◇◆■□☆◊　 ※──＝=═－=＝…⋯◯○~∞&%【《（「『』」》）】,，﹑\s　\u00A0]+/g, '.*')
		;
}

export default handleSearchInput
