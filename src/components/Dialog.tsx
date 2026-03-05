import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';

import { useDialog } from '../hooks/useDialogStore';
import { Action } from '../types/dialogType';
import { getCountryIcon, getCountryName } from '../utils/country';
import { useRegion } from '../hooks/useRegionStore';

const getCaretCharacterOffsetWithin = (element: HTMLElement) => {
  const doc = element.ownerDocument || document;
  const win = doc.defaultView || window;
  const sel = win.getSelection();

  let caretOffset = 0;

  if (sel && sel.rangeCount > 0) {
    const range = sel.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;
  }

  return caretOffset;
};

const setCaretPosition = (element: HTMLElement, offset: number) => {
  const sel = window.getSelection();
  const range = document.createRange();

  let charIndex = 0;
  let found = false;

  if (!sel) return;

  const traverseNodes = (node: Node) => {
    if (found) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharIndex = charIndex + (node.textContent?.length || 0);

      if (!found && offset >= charIndex && offset <= nextCharIndex) {
        range.setStart(node, offset - charIndex);
        range.collapse(true);

        found = true;
      }

      charIndex = nextCharIndex;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverseNodes(node.childNodes[i]);
      }
    }
  };

  traverseNodes(element);

  if (!found) {
    range.selectNodeContents(element);
    range.collapse(false);
  }

  sel.removeAllRanges();
  sel.addRange(range);
};

export function Dialog() {
  const { action, setAction } = useDialog();
  const { countryCode } = useRegion();

  const [sampleReivew, setSampleReview] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);
  const backup = useRef<{ html: string; caret: number }>({
    html: '',
    caret: 0,
  });

  const sampleReviews = [
    'pretty solid everyday pick.\nnot too sweet, which is nice.\n\nwould buy again.',
    'tastes exactly how it should.\nclean finish, no weird aftertaste.\n\ngood stuff.',
    'actually really good.\nlight and refreshing.\n\ndefinitely going in the fridge.',
    "wasn't expecting much but it hits.\nperfect for the afternoon.\n\nsolid.",
    "simple. clean.\ndoesn't try too hard.\n\na new favorite.",
    'smooth texture, great taste.\neasy to drink.\n\nwill stock up.',
    'does the job perfectly.\nnot overly artificial.\n\nnice pickup.',
    'really crisp.\nexactly what i needed today.\n\nrecommend it.',
    'surprisingly good.\nsubtle flavor, nothing crazy.\n\nworth trying.',
    'straight to the point.\ntastes great cold.\n\nwould get another.',
  ];

  useEffect(() => {
    if (action === Action.Reviewing) {
      setSampleReview(
        sampleReviews[Math.floor(Math.random() * sampleReviews.length)],
      );

      contentRef.current?.focus();
    }
  }, [action]);

  return (
    <motion.div
      className="w-[360px] top-1/2 right-[max(40px_,_calc((100%_-_1840px)_/_2))] fixed flex flex-col gap-5 -translate-y-1/2 z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="w-[360px] p-5 relative flex flex-col gap-5 bg-white border border-black">
        <div className="sticky top-0 flex flex-col gap-1">
          <p>write your review</p>
          <small className="block text-ellipsis overflow-hidden whitespace-nowrap">
            of Citrus Flavoured Soft Drink
          </small>
        </div>
        <div
          ref={contentRef}
          className="min-h-[72px] max-h-[180px] textarea w-full shrink-0 bg-transparent whitespace-pre-wrap overflow-hidden"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={sampleReivew}
          onBeforeInput={() => {
            if (!contentRef.current) return;

            backup.current = {
              html: contentRef.current.innerHTML,
              caret: getCaretCharacterOffsetWithin(contentRef.current),
            };
          }}
          onInput={(e) => {
            if (!contentRef.current) return;

            if (e.currentTarget.scrollHeight > 182) {
              contentRef.current.innerHTML = backup.current.html;

              setCaretPosition(contentRef.current, backup.current.caret);
            } else {
              backup.current = {
                html: contentRef.current.innerHTML,
                caret: getCaretCharacterOffsetWithin(contentRef.current),
              };
            }

            setContent(contentRef.current.innerText);
          }}
        />
        <button
          disabled={!content.trim()}
          className="h-11 mt-2.5 bg-white border border-black enabled:hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          submit
        </button>
      </div>
    </motion.div>
  );
}
