const { file } = req;
const { width, height, compress } = req.body;
const { directory, formatFileName } = destination(file);

if (file.mimetype.startsWith('image')) {
  if (compress == 'true') {
    await sharp(file.buffer)
      .resize(Number(width), Number(height))
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(path.join(`${directory + '/' + formatFileName}`));
  } else {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  }
} else if (file.mimetype.startsWith('audio')) {
  if (compress == 'true') {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  } else {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  }
} else if (file.mimetype.startsWith('video')) {
  if (compress == 'true') {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  } else {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  }
} else if (file.mimetype.startsWith('text')) {
  if (compress == 'true') {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  } else {
    await sharp(file.buffer).toFile(path.join(`${directory + '/' + formatFileName}`));
  }
}

console.log(file);

file.fileUrl = `http://localhost:8080/${directory}/${formatFileName}`;
file.path = `/${directory + '/' + formatFileName}`;
