const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to the Short Link!</h1>

      <div className="text-center mb-6">
        <p className="text-xl">Here's a bit about me:</p>
        <p className="mt-2 text-lg">
          I'm passionate about web development and always looking to learn and
          grow. Check out my portfolio below!
        </p>
      </div>

      <div className="flex space-x-6">
        <a
          href="https://github.com/Mezba132"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-lg"
        >
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/mezba132/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline text-lg"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
};

export default Home;
