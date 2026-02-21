import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, Transition, useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const [searching, setSearching] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [scope, animate] = useAnimate();
  const navigate = useNavigate();

  const textTransition = {
    duration: 1,
    ease: 'easeOut',
  } satisfies Transition;

  useEffect(() => {
    const handleClick = (e: Event) => {
      if (!searchContainerRef.current) return;

      if (searchContainerRef.current.contains(e.target as Node)) {
        setSearching(true);
      } else {
        setSearching(false);
      }
    };

    document.addEventListener('click', handleClick, false);

    return () => {
      document.removeEventListener('click', handleClick, false);
    };
  }, []);

  useEffect(() => {
    if (searching) return;

    let stopped = false;
    let controls: any[] = [];

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const loopMarquee = async () => {
      while (!stopped) {
        await sleep(2000);
        if (stopped || !scope.current) break;

        controls = [
          animate('p:first-child', { y: [0, 18] }, textTransition),
          animate('p:last-child', { y: [-36, -18] }, textTransition),
        ];
        await Promise.all(controls);

        await sleep(2000);
        if (stopped || !scope.current) break;

        controls = [
          animate('p:first-child', { y: [-18, 0] }, textTransition),
          animate('p:last-child', { y: [-18, 0] }, textTransition),
        ];
        await Promise.all(controls);
      }
    };

    loopMarquee();

    return () => {
      stopped = true;
      controls.forEach((c) => c.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searching, animate]);

  useEffect(() => {
    if (searching) {
      if (!searchInputRef.current) return;

      searchInputRef.current.value = '';
      searchInputRef.current.focus();
    }
  }, [searching]);

  return (
    <div className="flex justify-center">
      <div className="w-[1840px] max-w-[calc(100%_-_80px)] h-20 fixed flex items-center justify-between z-10">
        <div className="relative flex flex-col gap-5">
          <div
            className="w-80 h-[18px] flex gap-1 overflow-hidden shrink-0"
            ref={searchContainerRef}
          >
            <p>search</p>
            <AnimatePresence>
              <div className="h-full w-full relative overflow-hidden">
                {!searching && (
                  <div className="min-w-0 h-full flex flex-col" ref={scope}>
                    {
                      // temp
                      [
                        'Mountain Dew Citrus Flavored Soft Drink',
                        'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
                      ].map((text, i) => (
                        <motion.p
                          key={i}
                          className="w-full h-full text-ellipsis overflow-hidden whitespace-nowrap shrink-0"
                        >
                          {text}
                        </motion.p>
                      ))
                    }
                  </div>
                )}
                <input
                  className={`w-full h-full absolute flex-1 bg-transparent ${
                    searching ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  ref={searchInputRef}
                  type="text"
                />
              </div>
            </AnimatePresence>
          </div>
          <AnimatePresence>
            {searching && (
              <motion.div
                className="w-[360px] top-full mt-5 p-5 absolute bg-white border border-black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              ></motion.div>
            )}
          </AnimatePresence>
        </div>
        <p
          className="cursor-pointer hover:underline"
          onClick={() => navigate('/')}
        >
          tasteshelf.com
        </p>
      </div>
    </div>
  );
}
