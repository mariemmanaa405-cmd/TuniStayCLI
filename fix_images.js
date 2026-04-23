const fs = require('fs');

try {
  let welcomeFile = 'src/screens/WelcomeScreen.tsx';
  let welcomeContent = fs.readFileSync(welcomeFile, 'utf8');
  // Replace any unsplash or loremflickr image with the definitive Sidi Bou Said photo
  welcomeContent = welcomeContent.replace(
    /uri:\s*'[a-zA-Z0-9_\-\.:/?=&,]+'/g, 
    "uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Sidi_Bou_Said_street.jpg/800px-Sidi_Bou_Said_street.jpg'"
  );
  fs.writeFileSync(welcomeFile, welcomeContent);
  console.log('WelcomeScreen updated.');

  let aboutFile = 'src/screens/AboutUsScreen.tsx';
  let aboutContent = fs.readFileSync(aboutFile, 'utf8');
  // Replace with the definitive Dougga / Roman Ruins beautiful photo
  aboutContent = aboutContent.replace(
    /uri:\s*'[a-zA-Z0-9_\-\.:/?=&,]+'/g, 
    "uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Sahara_desert_Tunisia.jpg/800px-Sahara_desert_Tunisia.jpg'"
  );
  fs.writeFileSync(aboutFile, aboutContent);
  console.log('AboutUsScreen updated.');
} catch (err) {
  console.error(err);
}
