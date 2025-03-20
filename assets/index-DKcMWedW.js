var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const ERROR_MESSAGE = {
  3: "인증 실패: 서비스 접근 권한이 없습니다.",
  4: "잘못된 형식: 해당 형식의 서비스는 존재하지 않습니다.",
  5: "잘못된 매개변수: 요청 매개변수가 올바르지 않습니다.",
  7: "유효하지 않은 API 키: 유효한 키가 부여되어야 합니다.",
  9: "서비스 오프라인: 이 서비스는 일시적으로 오프라인 상태입니다. 나중에 다시 시도하세요.",
  10: "정지된 API 키: 귀하의 계정 접근이 정지되었습니다. TMDB에 문의하세요.",
  11: "내부 오류: 문제가 발생했습니다. TMDB에 문의하세요.",
  14: "인증 실패.",
  15: "실패했습니다.",
  18: "검증 실패.",
  19: "유효하지 않은 accept 헤더입니다.",
  22: "잘못된 페이지: 페이지는 1부터 500 사이의 정수여야 합니다.",
  24: "백엔드 서버 요청 시간이 초과되었습니다. 다시 시도하세요.",
  25: "요청 횟수 (#)가 허용 한도(40)를 초과했습니다.",
  31: "계정이 비활성화되었습니다. TMDB에 문의하세요.",
  33: "유효하지 않은 요청 토큰: 토큰이 만료되었거나 올바르지 않습니다.",
  34: "요청하신 리소스를 찾을 수 없습니다.",
  35: "유효하지 않은 토큰입니다.",
  42: "해당 리소스는 이 요청 메서드를 지원하지 않습니다.",
  43: "백엔드 서버에 연결할 수 없습니다.",
  46: "API가 유지보수 중입니다. 나중에 다시 시도하세요.",
  47: "입력이 올바르지 않습니다."
};
class HeaderController {
  constructor({
    renderSearchMovieList,
    renderMovieList
  }) {
    __publicField(this, "searchBarElement");
    __publicField(this, "headerLogoElement");
    this.searchBarElement = document.querySelector(
      ".search-bar"
    );
    this.headerLogoElement = document.querySelector(
      ".header-wrapper .logo"
    );
    this.bindSearchEvent(renderSearchMovieList);
    this.bindHomeLogoEvent(renderMovieList);
  }
  bindSearchEvent(renderSearchMovieList) {
    this.searchBarElement.addEventListener(
      "submit",
      async (event) => {
        var _a;
        event.preventDefault();
        const formElement = event.target;
        const target = formElement.querySelector("input");
        const searchValue = target.value;
        (_a = document.querySelector(".background-container")) == null ? void 0 : _a.classList.add("search");
        renderSearchMovieList(searchValue);
      }
    );
  }
  bindHomeLogoEvent(renderMovieList) {
    var _a;
    (_a = this.headerLogoElement) == null ? void 0 : _a.addEventListener("click", () => {
      var _a2;
      renderMovieList();
      (_a2 = document.querySelector(".background-container")) == null ? void 0 : _a2.classList.remove("search");
      const inputElement = this.searchBarElement.querySelector(
        "input"
      );
      inputElement.value = "";
    });
  }
}
const createDOMElement = ({
  tag,
  children,
  ...props
}) => {
  if (!tag) throw new Error("Tag is required");
  const element = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (key === "class") {
      if (Array.isArray(value)) {
        value.forEach((className) => {
          element.classList.add(className);
        });
      } else if (typeof value === "string") {
        value.split(" ").forEach((className) => {
          if (className !== "") element.classList.add(className);
        });
      }
    }
    if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child) element.appendChild(child);
      });
    } else {
      element.appendChild(children);
    }
  }
  return element;
};
const MessageModal = (message) => {
  return createDOMElement({
    tag: "dialog",
    class: "modal-container",
    children: [
      createDOMElement({
        tag: "div",
        class: "modal-content-box",
        children: [
          createDOMElement({
            tag: "img",
            src: "./images/empty_planet.svg"
          }),
          createDOMElement({
            tag: "span",
            textContent: message
          })
        ]
      })
    ]
  });
};
class MessageModalController {
  constructor(mainElement) {
    __publicField(this, "mainElement");
    __publicField(this, "messageModalElement");
    this.mainElement = mainElement;
    this.messageModalElement = MessageModal("");
    this.renderMessageModalFrame();
  }
  bindEvents() {
    this.messageModalElement.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) this.messageModalElement.close();
    });
  }
  renderMessageModalFrame() {
    this.mainElement.insertAdjacentElement(
      "afterend",
      this.messageModalElement
    );
    this.bindEvents();
  }
  changeContentMessage(text) {
    const spanElement = this.messageModalElement.querySelector(
      "span"
    );
    if (spanElement) spanElement.innerText = text;
  }
}
const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZThhNDlhOTBiZTY2N2I5ZmQ1ZjZjNzc2ZDNjN2YzNSIsIm5iZiI6MTY3NDExNTMzNy4yNjQ5OTk5LCJzdWIiOiI2M2M4ZjkwOTdhOTdhYjAwOGFjYTU1YzYiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.22bcvjrGHSjjoG-TFLh0XbuHMU-oSEHlsc0_IgAUu8I";
const BASE_URL = "https://api.themoviedb.org/3";
const baseApi = async (path, query) => {
  const defaultParams = { language: "ko-KR" };
  const searchParams = new URLSearchParams(
    Object.entries({ ...defaultParams, ...query }).reduce(
      (acc, [key, value]) => {
        if (value !== void 0) {
          acc[key] = String(value);
        }
        return acc;
      },
      {}
    )
  );
  const url = `${BASE_URL}${path}?${searchParams.toString()}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TOKEN}`
    }
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.status_code);
  }
  return await response.json();
};
const getPopularMovieResult = async (page) => {
  const movieResult = await baseApi("/movie/popular", { page });
  return movieResult;
};
const BackgroundThumbnailSection = (movie) => {
  return createDOMElement({
    tag: "div",
    class: "background-container",
    children: [
      createDOMElement({
        tag: "img",
        class: "background-thumbnail",
        src: `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.backdrop_path}`
      }),
      createDOMElement({
        tag: "div",
        class: "overlay",
        "aria-hidden": "true"
      }),
      createDOMElement({
        tag: "div",
        class: "top-rated-container",
        children: createDOMElement({
          tag: "div",
          class: "top-rated-movie",
          children: [
            createDOMElement({
              tag: "div",
              class: "rate",
              children: [
                createDOMElement({
                  tag: "img",
                  class: "star",
                  src: "./images/star_empty.png"
                }),
                createDOMElement({
                  tag: "span",
                  class: "rate-value",
                  textContent: movie.vote_average
                })
              ]
            }),
            createDOMElement({
              tag: "div",
              class: "title",
              textContent: movie.title
            }),
            createDOMElement({
              tag: "button",
              class: "primary detail",
              textContent: "자세히 보기"
            })
          ]
        })
      })
    ]
  });
};
const defaultImage = "/javascript-movie-review/assets/default_poster_image-COpmb5GC.png";
const MovieItem = (movie) => {
  return createDOMElement({
    tag: "li",
    children: [
      createDOMElement({
        tag: "div",
        class: "item",
        children: [
          createDOMElement({
            tag: "img",
            class: "thumbnail",
            src: movie.poster_path ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}` : defaultImage,
            alt: movie.title
          }),
          createDOMElement({
            tag: "div",
            class: "item-desc",
            children: [
              createDOMElement({
                tag: "p",
                class: "rate",
                children: [
                  createDOMElement({
                    tag: "img",
                    class: "star",
                    src: "./images/star_empty.png"
                  }),
                  createDOMElement({
                    tag: "span",
                    textContent: movie.vote_average
                  })
                ]
              }),
              createDOMElement({
                tag: "strong",
                textContent: movie.title
              })
            ]
          })
        ]
      })
    ]
  });
};
const MovieListSection = ({
  title,
  movieList,
  hasMore
}) => {
  return createDOMElement({
    tag: "section",
    children: [
      createDOMElement({
        tag: "h2",
        textContent: title
      }),
      createDOMElement({
        tag: "ul",
        class: "thumbnail-list",
        children: movieList.map((movie) => MovieItem(movie))
      }),
      hasMore ? createDOMElement({
        tag: "div",
        class: "see-more",
        textContent: "더 보기"
      }) : null
    ]
  });
};
const SkeletonBackgroundThumbnailSection = () => {
  return createDOMElement({
    tag: "div",
    class: "background-container skeleton"
  });
};
const SkeletonMovieItem = () => {
  return createDOMElement({
    tag: "div",
    class: "skeleton thumbnail"
  });
};
const SkeletonMovieListSection = () => {
  return createDOMElement({
    tag: "section",
    children: [
      createDOMElement({
        tag: "h2",
        class: "skeleton list-title"
      }),
      createDOMElement({
        tag: "ul",
        class: "thumbnail-list",
        children: Array.from({ length: 20 }).map(() => SkeletonMovieItem())
      })
    ]
  });
};
const MovieResults = () => {
  const movieList = [];
  let page = 0;
  let maxPage = 0;
  const addMovieList = (newPage, list) => {
    movieList.push(...list);
    page = newPage;
  };
  const initialTotalPage = (totalPage) => {
    maxPage = totalPage;
  };
  return {
    getMovieList: () => [...movieList],
    getPage: () => page,
    hasMore: () => page !== maxPage,
    addMovieList,
    initialTotalPage
  };
};
class MovieListController {
  constructor({
    mainElement,
    openModal
  }) {
    __publicField(this, "movieResults");
    __publicField(this, "mainElement");
    __publicField(this, "openModal");
    this.movieResults = MovieResults();
    this.mainElement = mainElement;
    this.openModal = openModal;
  }
  bindEvents() {
    const seeMoreElement = this.mainElement.querySelector(".see-more");
    seeMoreElement == null ? void 0 : seeMoreElement.addEventListener("click", () => {
      this.addMovieList();
    });
  }
  async fetchAndStoreMovies(page = 1) {
    const {
      page: newPage,
      total_pages: totalPage,
      results: movieList
    } = await getPopularMovieResult(page);
    this.movieResults.addMovieList(newPage, movieList);
    this.movieResults.initialTotalPage(totalPage);
    return { movieList, hasMore: newPage !== totalPage };
  }
  async render() {
    const skeletonBackgroundElement = this.renderSkeleton();
    const { movieList, hasMore } = await this.fetchAndStoreMovies();
    this.renderMovieList({
      movieList,
      hasMore,
      skeletonBackgroundElement
    });
    this.bindEvents();
  }
  renderSkeleton() {
    var _a;
    const skeletonSectionElement = SkeletonMovieListSection();
    this.mainElement.replaceChildren(skeletonSectionElement);
    const skeletonBackgroundElement = SkeletonBackgroundThumbnailSection();
    (_a = this.mainElement) == null ? void 0 : _a.insertAdjacentElement(
      "beforebegin",
      skeletonBackgroundElement
    );
    return skeletonBackgroundElement;
  }
  renderMovieList({
    movieList,
    hasMore,
    skeletonBackgroundElement
  }) {
    const sectionElement = MovieListSection({
      title: "지금 인기 있는 영화",
      movieList,
      hasMore
    });
    this.mainElement.replaceChildren(sectionElement);
    const backgroundThumbnailSectionElement = BackgroundThumbnailSection(
      movieList[0]
    );
    skeletonBackgroundElement.replaceWith(backgroundThumbnailSectionElement);
    const detailButtonElement = backgroundThumbnailSectionElement.querySelector(
      "button.detail"
    );
    detailButtonElement.addEventListener(
      "click",
      () => this.openModal("아직 지원되지 않은 기능입니다.")
    );
  }
  renderBackgroundSection() {
    var _a;
    const skeletonBackgroundElement = SkeletonBackgroundThumbnailSection();
    (_a = this.mainElement) == null ? void 0 : _a.insertAdjacentElement(
      "beforebegin",
      skeletonBackgroundElement
    );
    return skeletonBackgroundElement;
  }
  async renderExistingMovieList() {
    const movieList = this.movieResults.getMovieList();
    const hasMore = this.movieResults.hasMore();
    const sectionElement = MovieListSection({
      title: "지금 인기 있는 영화",
      movieList,
      hasMore
    });
    this.mainElement.replaceChildren(sectionElement);
    this.bindEvents();
  }
  async addMovieList() {
    var _a;
    const movieListContainer = this.mainElement.querySelector("ul");
    if (!movieListContainer) return;
    const skeletonElements = Array.from(
      { length: 20 },
      () => SkeletonMovieItem()
    );
    skeletonElements.forEach(
      (skeleton) => movieListContainer.appendChild(skeleton)
    );
    const { movieList, hasMore } = await this.fetchAndStoreMovies(
      this.movieResults.getPage() + 1
    );
    skeletonElements.forEach((skeleton) => skeleton.remove());
    movieList.forEach(
      (movie) => movieListContainer.appendChild(MovieItem(movie))
    );
    if (!hasMore) (_a = this.mainElement.querySelector(".see-more")) == null ? void 0 : _a.remove();
  }
}
const getSearchMovieResult = async (inputData, page) => {
  const searchResult = await baseApi("/search/movie", {
    query: inputData,
    include_adult: false,
    page
  });
  return searchResult;
};
const MovieEmptySection = (title) => {
  return createDOMElement({
    tag: "section",
    children: [
      createDOMElement({
        tag: "h2",
        textContent: title
      }),
      createDOMElement({
        tag: "div",
        class: "empty-wrapper",
        children: [
          createDOMElement({
            tag: "img",
            src: "./images/empty_planet.svg"
          }),
          createDOMElement({
            tag: "h2",
            textContent: "검색 결과가 없습니다."
          })
        ]
      })
    ]
  });
};
class SearchMovieListController {
  constructor(mainElement, searchText) {
    __publicField(this, "mainElement");
    __publicField(this, "searchText");
    __publicField(this, "page", 0);
    this.mainElement = mainElement;
    this.searchText = searchText;
    this.render();
  }
  bindEvents() {
    const seeMoreElement = this.mainElement.querySelector(".see-more");
    seeMoreElement == null ? void 0 : seeMoreElement.addEventListener("click", () => {
      this.addMovieList();
    });
  }
  async fetchMovies() {
    const {
      page: newPage,
      total_pages: totalPage,
      results: movieList
    } = await getSearchMovieResult(
      this.searchText,
      this.page + 1
    );
    this.page = newPage;
    const hasMore = newPage !== totalPage;
    return { movieList, hasMore };
  }
  async render() {
    this.renderSkeleton();
    const { movieList, hasMore } = await this.fetchMovies();
    this.renderSearchMovieList({ movieList, hasMore });
    this.bindEvents();
  }
  renderSkeleton() {
    const skeletonSectionElement = SkeletonMovieListSection();
    this.mainElement.replaceChildren(skeletonSectionElement);
  }
  renderSearchMovieList({
    movieList,
    hasMore
  }) {
    let sectionElement;
    if (movieList.length !== 0) {
      sectionElement = MovieListSection({
        title: `"${this.searchText}" 검색 결과`,
        movieList,
        hasMore
      });
    } else {
      sectionElement = MovieEmptySection(`"${this.searchText}" 검색 결과`);
    }
    this.mainElement.replaceChildren(sectionElement);
  }
  async addMovieList() {
    var _a;
    const movieListContainer = this.mainElement.querySelector("ul");
    if (!movieListContainer) return;
    const skeletonElements = Array.from(
      { length: 20 },
      () => SkeletonMovieItem()
    );
    skeletonElements.forEach((skeletonElement) => {
      movieListContainer == null ? void 0 : movieListContainer.appendChild(skeletonElement);
    });
    const { movieList, hasMore } = await this.fetchMovies();
    skeletonElements.forEach((skeletonElement) => {
      skeletonElement.remove();
    });
    movieList.forEach((movie) => {
      movieListContainer == null ? void 0 : movieListContainer.appendChild(MovieItem(movie));
    });
    if (!hasMore) (_a = this.mainElement.querySelector(".see-more")) == null ? void 0 : _a.remove();
  }
}
class MainController {
  constructor() {
    __publicField(this, "mainElement");
    __publicField(this, "messageModalController");
    __publicField(this, "movieListController");
    this.mainElement = document.querySelector("main");
    this.messageModalController = new MessageModalController(this.mainElement);
    this.movieListController = new MovieListController({
      mainElement: this.mainElement,
      openModal: (text) => {
        this.messageModalController.changeContentMessage(text);
        this.messageModalController.messageModalElement.showModal();
      }
    });
    new HeaderController({
      renderSearchMovieList: (searchValue) => new SearchMovieListController(this.mainElement, searchValue),
      renderMovieList: () => this.movieListController.renderExistingMovieList()
    });
  }
  async render() {
    try {
      await this.movieListController.render();
    } catch (error) {
      this.messageModalController.changeContentMessage(
        ERROR_MESSAGE[Number(error.message)] || "알 수 없는 오류가 발생했습니다."
      );
      this.messageModalController.messageModalElement.showModal();
    }
  }
}
const main = new MainController();
async function init() {
  await main.render();
}
init();
