import { Sun, Zap, Triangle } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="text-center text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to Alex</h1>
      <p className="text-lg mb-8">Your personal English tutor. Ask me anything!</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <div className="bg-gray-800 p-4 rounded-lg">
          <Sun className="h-6 w-6 mb-2 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Examples</h2>
          <p className="text-sm">"Explain the difference between 'affect' and 'effect'."</p>
          <p className="text-sm">"Give me some tips for improving my pronunciation."</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <Zap className="h-6 w-6 mb-2 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Capabilities</h2>
          <p className="text-sm">I can help you with grammar, vocabulary, and conversation practice.</p>
          <p className="text-sm">I can also provide you with feedback on your writing.</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg">
          <Triangle className="h-6 w-6 mb-2 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Limitations</h2>
          <p className="text-sm">I am still under development, so I may not always be perfect.</p>
          <p className="text-sm">Please be patient with me and provide feedback to help me improve.</p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
