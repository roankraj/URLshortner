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

      if (!response.ok) {
        throw new Error(Data.message);
      }

      setData(Data);
    } catch (err) {
      setData(null);
      setError(err.message);

      setTimeout(() => {
        setError('');
      }, 2000);
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

      setTimeout(() => {
        setError('');
      }, 2000);
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        flex-col
        items-center
        bg-[#FFF4F4]
        px-4
        pt-40
        font-[Arial]
        text-base
        sm:pt-48
        md:pt-52
      "
    >
      <h1
        className="
          mb-6
          text-center
          text-3xl
          font-bold
          text-[#5757FF]
          sm:text-4xl
        "
      >
        URL Shortner
      </h1>

      <div className="relative mb-8 w-full max-w-2xl">
        <form
          className="
            flex
            w-full
            flex-col
            gap-3
            sm:flex-row
            sm:gap-5
          "
          onSubmit={getURL}
        >
          <input
            type="text"
            onChange={(e) => setURL(e.target.value)}
            value={URL}
            placeholder="Enter the link here"
            className="
              h-11
              w-full
              min-w-0
              rounded-full
              bg-[#8C8573]
              px-5
              py-3
              text-white
              placeholder:text-base
              placeholder:text-white
              focus:outline-[#222222]
              sm:flex-1
            "
          />

          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.97, y: 1 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
            }}
            type="submit"
            disabled={loading}
            className="
              h-11
              shrink-0
              rounded-full
              bg-[#2222FF]
              px-5
              font-semibold
              text-white
              cursor-pointer
              focus:outline-[#222222]
              disabled:cursor-not-allowed
              disabled:opacity-70
            "
          >
            Shorten URL
          </motion.button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ ease: easeOut }}
              className="
                absolute
                left-0
                right-0
                top-full
                mt-2
                text-center
                text-sm
                font-bold
                text-red-700
              "
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

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
              className="
                size-3
                animate-pulse
                rounded-full
                bg-[#5757FF]
              "
              aria-hidden="true"
            />

            <span
              className="
                size-3
                animate-pulse
                rounded-full
                bg-[#5757FF]
                [animation-delay:0.2s]
              "
              aria-hidden="true"
            />

            <span
              className="
                size-3
                animate-pulse
                rounded-full
                bg-[#5757FF]
                [animation-delay:0.4s]
              "
              aria-hidden="true"
            />
          </motion.div>
        </AnimatePresence>
      ) : data ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ease: easeOut }}
          className="
            flex
            max-w-2xl
            items-center
            justify-center
            gap-3
            px-2
          "
        >
          <div className="relative flex shrink-0 items-center">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={handleCopyClick}
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 15,
              }}
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />

              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
            </motion.svg>

            <AnimatePresence>
              {isCopied && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ ease: easeOut }}
                  className="
                    absolute
                    bottom-full
                    left-1/2
                    mb-2
                    -translate-x-1/2
                    whitespace-nowrap
                    text-sm
                    font-semibold
                    text-blue-700
                  "
                >
                  Copied
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <span
            className="
              min-w-0
              break-all
              text-center
              text-sm
              font-bold
              sm:text-lg
              md:text-xl
            "
          >
            {`${API_URL}/${data.data.short}`}
          </span>
        </motion.div>
      ) : null}
    </div>
  );
}

export default App;
