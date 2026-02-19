import { useNavigate } from 'react-router-dom';
import { motion, Transition, useAnimate } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export function Header() {
  const [searching, setSearching] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [scope, animate] = useAnimate();
  const navigate = useNavigate();

  const textTransition = {
    duration: 1,
    ease: 'easeInOut',
  } satisfies Transition;

  useEffect(() => {
    let stopped = false;
    let controls: any[] = [];

    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    const loopMarquee = async () => {
      while (!stopped) {
        await sleep(2000);
        if (stopped) break;

        controls = [
          animate('p:first-child', { y: [0, 18] }, textTransition),
          animate('p:last-child', { y: [-36, -18] }, textTransition),
        ];
        await Promise.all(controls);

        await sleep(2000);
        if (stopped) break;

        controls = [
          animate('p:first-child', { y: [-18, 0] }, textTransition),
          animate('p:last-child', { y: [-18, 0] }, textTransition),
        ];
        await Promise.all(controls);
      }
    };

    const handleClick = (e: Event) => {
      if (!searchContainerRef.current) return;

      if (searchContainerRef.current.contains(e.target as Node)) {
        setSearching(true);
      } else {
        setSearching(false);
      }
    };

    loopMarquee();
    document.addEventListener('click', handleClick, false);

    return () => {
      stopped = true;
      controls.forEach((c) => c.stop());
      document.removeEventListener('click', handleClick, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animate]);

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
            className="w-[360px] h-[18px] flex gap-1 overflow-hidden shrink-0"
            ref={searchContainerRef}
          >
            <p>search</p>
            <div
              className={`min-w-0 h-full flex flex-col ${
                searching ? 'hidden' : 'inline-block'
              }`}
              ref={scope}
            >
              {[
                'Mountain Dew Citrus Flavored Soft Drink',
                'Red Bull Yellow Edition Energy Drink (Tropical Flavor)',
              ].map((text, i) => (
                <motion.p
                  key={i}
                  className="min-w-0 h-full text-ellipsis overflow-hidden whitespace-nowrap shrink-0"
                >
                  {text}
                </motion.p>
              ))}
            </div>
            <input
              className={`flex-1 ${
                searching ? 'inline-block' : 'hidden'
              } bg-transparent`}
              ref={searchInputRef}
              type="text"
            />
          </div>
          {searching ? (
            <div className="w-[360px] top-full mt-5 p-5 absolute bg-white border border-black"></div>
          ) : undefined}
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
