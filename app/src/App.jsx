import { easeOut, motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [URL, setURL] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const getURL = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({ url: URL });
      const response = await fetch(`${API_URL}?${params}`, {
        method: 'POST',
      });
      const Data = await response.json();

      if (!response.ok) throw new Error(Data.message);

      setData(Data);
    } catch (err) {
      setData(null);
      setError(err.message);
    } finally {
      setLoading(false);
      setURL('');
    }
  };

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(`${API_URL}/${data.data.short}`);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-[#FFF4F4] font-[Arial] min-h-screen w-full flex flex-col items-center text-base relative">
      <h1 className="text-[#5757FF] font-bold text-4xl mb-6 mt-42">
        URL Shortner
      </h1>

      <form className="flex gap-7 mb-11" onSubmit={getURL}>
        <input
          type="text"
          onChange={(e) => setURL(e.target.value)}
          value={URL}
          placeholder="Enter the link here"
          className="w-123 h-11 rounded-full placeholder:text-white placeholder:text-base bg-[#8C8573] pl-5 py-3 text-white focus:outline-[#222222]"
        />
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97, y: 1 }}
          transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          type="submit"
          className="font-semibold text-white bg-[#2222FF] py-3 px-5 rounded-full hover:cursor-pointer focus:outline-[#222222]"
          disabled={loading}
        >
          Shorten URL
        </motion.button>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ ease: easeOut }}
              className="top-74 right-145 font-bold text-red-700 absolute"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </form>

      {loading ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: easeOut }}
            className="flex gap-2"
            role="status"
            aria-label="Loading"
          >
            <span
              className="size-3 animate-pulse rounded-full bg-[#5757FF]"
              aria-hidden="true"
            ></span>
            <span
              className="size-3 animate-pulse rounded-full bg-[#5757FF] [animation-delay:0.2s]"
              aria-hidden="true"
            ></span>
            <span
              className="size-3 animate-pulse rounded-full bg-[#5757FF] [animation-delay:0.4s]"
              aria-hidden="true"
            ></span>
          </motion.div>
        </AnimatePresence>
      ) : data ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            ease: easeOut,
          }}
          className="flex gap-4 relative"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-copy-icon lucide-copy"
            onClick={handleCopyClick}
            className="hover:cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 150, damping: 15 }}
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </motion.svg>
          <pre className="font-bold text-xl text-center">{`${API_URL}/${data.data.short}`}</pre>
          <AnimatePresence>
            {isCopied && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{
                  ease: easeOut,
                }}
                className="absolute bottom-6 right-114 rotate-315 font-semibold text-blue-700"
              >
                Copied
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ) : null}
    </div>
  );
}

export default App;
