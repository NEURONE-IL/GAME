//ROOT
process.env.ROOT = 'http://159.65.100.191:3030'

//PORT
process.env.PORT = process.env.PORT || 3090;

//PUBLIC PORT
process.env.PUBLIC_PORT = 3030;

//token secret
process.env.TOKEN_SECRET = 'ady7asdy78'

//DB
process.env.DB_USER = 'neuroneAdmin';

process.env.DB_PWD = 'DK,V-Dk6-*Pd-PM'

process.env.URI = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@localhost:27017/neuronegame`;
//process.env.URI = `mongodb://localhost:27017/neuronegame`;
process.env.USERURI = `mongodb://localhost:27017/neuronegameuser`;

//NEURONE GM

process.env.NEURONEGM = 'http://159.65.100.191:3080'
//process.env.NEURONEGM = 'http://localhost:3080'

//NEURONE GAME CLIENT
process.env.GAME_CLIENT = 'http://159.65.100.191:4200';

// NEURONE ASSETS PATH
process.env.NEURONE_DOCS = '/home/neurone/apps/neurone/assets'