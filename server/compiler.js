const fs = require('fs');
const path = require('path');
const riot = require('riot');

const tagsFolder = './tags';

module.exports = {
	compiledTags: new Promise((resolve, reject) => {
		fs.readdir(tagsFolder, (err, tags) => {
			if (err) { 
				reject(err)
			} else {
				resolve(
					tags.map((tagFile) => {
						const tagPath = path.relative(__dirname, path.join(tagsFolder, tagFile));
						const tag = require(tagPath);
						return riot.compile(tag);
					}));
			}
		});
	})
};
