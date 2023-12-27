exports.config = {
  paths: {
    public: './assets',
    watched: ['scss']
  },
  files: {
    stylesheets: {
      joinTo: 'style4.css'
    }
  },
  plugins: {
    sass: {
      options: {
        includePaths: ['scss']
      }
    }
  }
};
