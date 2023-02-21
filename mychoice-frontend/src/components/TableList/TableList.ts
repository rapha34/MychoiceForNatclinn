/*
Copyright INRAE
Contact contributor(s) : Rallou Thomopoulos / Julien Cufi (26/03/2020)
MyChoice is a web application supporting collective decision.
See more on https://ico.iate.inra.fr/MyChoice
This application is registered to the European organization for the
protection of authors and publishers of digital creations with
the following identifier: IDDN.FR.001.280002.000.R.P.2020.000.20900 

This software is governed by the CeCILL-C license under French law and
abiding by the rules of distribution of free software.  You can  use, 
modify and/ or redistribute the software under the terms of the CeCILL-C
license as circulated by CEA, CNRS and INRIA at the following URL
"http://www.cecill.info". 
As a counterpart to the access to the source code and  rights to copy,
modify and redistribute granted by the license, users are provided only
with a limited warranty  and the software's author,  the holder of the
economic rights,  and the successive licensors  have only  limited
liability. 
In this respect, the user's attention is drawn to the risks associated
with loading,  using,  modifying and/or developing or reproducing the
software by the user in light of its specific status of free software,
that may mean  that it is complicated to manipulate,  and  that  also
therefore means  that it is reserved for developers  and  experienced
professionals having in-depth computer knowledge. Users are therefore
encouraged to load and test the software's suitability as regards their
requirements in conditions enabling the security of their systems and/or 
data to be ensured and,  more generally, to use and operate it in the 
same conditions as regards security. 
The fact that you are presently reading this means that you have had
knowledge of the CeCILL-C license and that you accept its terms.
*/
const stickyElements = {
  root: null,
  container: null,
  yEnd: null,
  xStart: null,
  xEnd: null,
  yStart: null,
  xShadow: null,
  yShadow: null
} as {
  [key: string]: Element | null;
};
const stickyRects: {
  [key: string]: ClientRect | null;
} = {
  container: null,
  yStart: null,
  yEnd: null,
  xStart: null
};

export const addTableListStickyEvent = function(
  element: Element,
  rootMargin: string,
  callback: IntersectionObserverCallback
) {
  const observer = new IntersectionObserver(callback, {
    root: stickyElements.root,
    rootMargin: rootMargin,
    threshold: [1]
  });

  observer.observe(element);
};

export const saveStickyRects = () => {
  stickyRects.root = stickyElements!.root!.getBoundingClientRect();
  stickyRects.container = stickyElements!.container!.getBoundingClientRect();
  stickyRects.xStart = stickyElements!.xStart!.getBoundingClientRect();
  stickyRects.xEnd = stickyElements!.xEnd!.getBoundingClientRect();
  stickyRects.yStart = stickyElements!.yStart!.getBoundingClientRect();
  stickyRects.yEnd = stickyElements!.yEnd!.getBoundingClientRect();
};

export const initStickyElements = () => {
  stickyElements.root = document.querySelector(".tablelist");
  stickyElements.container = document.querySelector(".tablelist-container");

  stickyElements.xStart = document.querySelector(
    ".tablelist tbody td[criterion]"
  );
  stickyElements.xEnd = document.querySelector(".tablelist tbody td[aim]");
  stickyElements.yStart = document.querySelector(
    ".tablelist thead th[criterion]"
  );
  stickyElements.yEnd = document.querySelector(
    ".tablelist tfoot th[criterion-aim]"
  );
  stickyElements.xShadow = document.querySelector(".tablelist-x-shadow");
  stickyElements.yShadow = document.querySelector(".tablelist-y-shadow");
};

export const resizeYTableListShadow = () => {
  if (stickyElements.yShadow) {
    stickyElements.yShadow.setAttribute(
      "style",
      `top:${stickyRects.yStart!.bottom - 1}px; left:${
        stickyRects.yStart!.left
        //}px; width:${stickyRects.root!.width}px;`
      }px; width:calc(100% - ${stickyRects.yStart!.left * 2}px);`
    );
  }
};

export const resizeXTableListShadow = () => {
  if (stickyElements.xShadow) {
    stickyElements.xShadow.setAttribute(
      "style",
      `left:${stickyRects.xEnd!.right}px;  height:${stickyRects.yEnd!.top -
        stickyRects.container!.top}px; top:${stickyRects.container!.top}px;`
    );
  }
};

export const initTableListStickyEvents = () => {
  if (stickyElements.yStart) {
    addTableListStickyEvent(
      stickyElements.yStart,
      `-1px 0px 0px 1px`,
      ([e]) => {
        if (stickyElements.yShadow) {
          stickyElements.yShadow.classList.toggle(
            "is-pinned",
            e.intersectionRatio >= 1
          );
          resizeYTableListShadow();
        }
      }
    );
  }

  if (stickyElements.xStart) {
    addTableListStickyEvent(
      stickyElements.xStart,
      `-1px 0px 0px -1px`,
      ([e]) => {
        if (stickyElements.xShadow) {
          stickyElements.xShadow.classList.toggle(
            "is-pinned",
            e.intersectionRatio >= 1
          );
          resizeXTableListShadow();
        }
      }
    );
  }
};

export const handleStickyTableResize = () => {
  saveStickyRects();
  resizeYTableListShadow();
  resizeXTableListShadow();
  // handleStickyClones()
};

export const handleStickyClones = () => {
  console.info("RESIZE STICKY TABLE");
  const tablelistContainerElement = document.querySelector(
    ".tablelist-container"
  ) as HTMLDivElement;
  const TFootStickyElement = document.querySelector(
    "tfoot .is-sticky-clone"
  ) as HTMLDivElement;

  if (!tablelistContainerElement || !TFootStickyElement) {
    return;
  }
  const tablelistContainerRect = tablelistContainerElement.getBoundingClientRect();
  //const TFootStickyRect = TFootStickyElement.getBoundingClientRect();
  const referenceColElements = document.querySelectorAll(
    ".is-sticky-reference th"
  );
  const stickyColElements = document.querySelectorAll(".is-sticky-clone th");
  const referenceElements: {
    [id: string]: Element;
  } = {};
  referenceColElements.forEach((element, index) => {
    referenceElements[index] = element;
  });

  const stickyElements: {
    [id: string]: Element;
  } = {};
  stickyColElements.forEach((element, index) => {
    stickyElements[index] = element;
  });

  Object.keys(stickyElements).forEach(elementName => {
    const stickyElement = stickyElements[elementName] as HTMLDivElement;
    const referenceElement = referenceElements[elementName] as HTMLDivElement;
    if (!referenceElement || !referenceElement) {
      return;
    }
    const referenceRect = referenceElement.getBoundingClientRect();
    stickyElement.style.width = referenceRect.width.toString() + "px";
  });
  TFootStickyElement.style.top =
    Math.round(tablelistContainerRect.bottom).toString() + "px";
};

export const setStickyTable = () => {
  initStickyElements();
  saveStickyRects();
  initTableListStickyEvents();
};
