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
class HeaderView {
  constructor() {
    __publicField(this, "headerElement");
    __publicField(this, "searchBarElement");
    __publicField(this, "logoElement");
    __publicField(this, "inputElement");
    this.headerElement = document.querySelector(".header-wrapper");
    this.searchBarElement = this.headerElement.querySelector(".search-bar");
    this.logoElement = this.headerElement.querySelector(".logo");
    this.inputElement = this.searchBarElement.querySelector("input");
  }
  getSearchBarElement() {
    return document.querySelector(".search-bar");
  }
  getHeaderLogoElement() {
    return document.querySelector(".header-wrapper .logo");
  }
  getInputValue() {
    return this.inputElement.value;
  }
  blurInput() {
    this.inputElement.blur();
  }
  clearInput() {
    this.inputElement.value = "";
  }
  setSearchMode() {
    const backgroundElement = document.querySelector(".background-container");
    backgroundElement == null ? void 0 : backgroundElement.classList.add("search");
  }
  clearSearchMode() {
    const backgroundElement = document.querySelector(".background-container");
    backgroundElement == null ? void 0 : backgroundElement.classList.remove("search");
  }
  updateScrollStyle() {
    if (window.scrollY > 200) {
      this.headerElement.classList.add("scroll");
    } else {
      this.headerElement.classList.remove("scroll");
    }
  }
}
class HeaderController {
  constructor({
    renderSearchMovieList,
    renderMovieList
  }) {
    __publicField(this, "headerView");
    __publicField(this, "renderSearchMovieList");
    __publicField(this, "renderMovieList");
    this.headerView = new HeaderView();
    this.renderSearchMovieList = renderSearchMovieList;
    this.renderMovieList = renderMovieList;
  }
  initialize() {
    this.bindSearchEvent();
    this.bindHomeLogoClickEvent();
    this.bindScrollEvent();
  }
  bindSearchEvent() {
    const searchBarElement = this.headerView.getSearchBarElement();
    searchBarElement.addEventListener("submit", async (event) => {
      event.preventDefault();
      const searchValue = this.headerView.getInputValue();
      this.headerView.setSearchMode();
      this.renderSearchMovieList(searchValue);
      this.headerView.blurInput();
    });
  }
  bindHomeLogoClickEvent() {
    const headerLogoElement = this.headerView.getHeaderLogoElement();
    headerLogoElement == null ? void 0 : headerLogoElement.addEventListener("click", () => {
      this.renderMovieList();
      this.headerView.clearSearchMode();
      this.headerView.clearInput();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  bindScrollEvent() {
    window.addEventListener("scroll", () => {
      this.headerView.updateScrollStyle();
    });
  }
}
const createDOMElement = ({
  tag,
  children,
  className,
  ...props
}) => {
  if (!tag) throw new Error("Tag is required");
  const element = document.createElement(tag);
  applyClassName(element, className);
  applyAttributes(element, props);
  appendChildren(element, children);
  return element;
};
const applyClassName = (element, className) => {
  if (!className) return;
  const classList = className.split(" ").filter((c) => c.trim() !== "");
  classList.forEach((cls) => element.classList.add(cls));
};
const applyAttributes = (element, props) => {
  Object.entries(props).forEach(([key, value]) => {
    if (key in element) {
      element[key] = value;
    } else {
      element.setAttribute(key, value);
    }
  });
};
const appendChildren = (element, children) => {
  if (children) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        if (child) element.appendChild(child);
      });
    } else {
      element.appendChild(children);
    }
  }
};
const MessageModal = (message) => {
  return createDOMElement({
    tag: "dialog",
    className: "modal-container",
    children: [
      createDOMElement({
        tag: "div",
        className: "modal-content-box",
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
class EventEmitter {
  constructor() {
    __publicField(this, "events");
    this.events = {};
  }
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }
  emit(event, data) {
    if (!this.events[event]) return;
    this.events[event].forEach((callback) => callback(data));
  }
  off(event, callback) {
    this.events[event] = (this.events[event] || []).filter((cb) => cb !== callback);
  }
}
const eventEmitter = new EventEmitter();
class MessageModalController {
  constructor() {
    __publicField(this, "messageModalElement");
    this.messageModalElement = MessageModal("");
  }
  initialize() {
    this.render();
    this.bindEvents();
  }
  render() {
    document.body.appendChild(this.messageModalElement);
  }
  bindEvents() {
    this.messageModalElement.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) this.messageModalElement.close();
    });
    eventEmitter.on("openMessageModal:error", (code) => {
      const message = ERROR_MESSAGE[code] || "알 수 없는 오류가 발생했습니다.";
      this.changeMessage(message);
      this.messageModalElement.showModal();
    });
  }
  changeMessage(message) {
    const spanElement = this.messageModalElement.querySelector("span");
    if (spanElement) spanElement.innerText = message;
  }
}
async function ApiWrapper(callback) {
  try {
    eventEmitter.emit("loading:start");
    const result = await callback();
    return result;
  } catch (error) {
    const code = Number(error.message);
    eventEmitter.emit("openMessageModal:error", code);
  } finally {
    eventEmitter.emit("loading:end");
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
  const movieResult = await ApiWrapper(() => baseApi("/movie/popular", { page }));
  return movieResult;
};
const infinityScrollObserver = (target, callback) => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        observer.unobserve(target);
        callback().then(() => {
          observer.observe(target);
        });
      }
    },
    {
      root: null,
      threshold: 0.1
    }
  );
  observer.observe(target);
};
const defaultImage = "/javascript-movie-review/assets/default_poster_image-COpmb5GC.png";
const MovieItem = (movie) => {
  return createDOMElement({
    tag: "li",
    children: [
      createDOMElement({
        tag: "div",
        className: "item",
        id: movie.id,
        children: [
          createDOMElement({
            tag: "div",
            className: "thumbnail-wrapper loading",
            children: [
              createDOMElement({
                tag: "img",
                className: "thumbnail",
                src: movie.poster_path ? `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}` : defaultImage,
                alt: movie.title,
                onload: function() {
                  var _a;
                  (_a = this.parentElement) == null ? void 0 : _a.classList.remove("loading");
                }
              })
            ]
          }),
          createDOMElement({
            tag: "div",
            className: "item-desc",
            children: [
              createDOMElement({
                tag: "p",
                className: "rate",
                children: [
                  createDOMElement({
                    tag: "img",
                    className: "star",
                    src: "./images/star_empty.png"
                  }),
                  createDOMElement({
                    tag: "span",
                    textContent: Number(movie.vote_average).toFixed(2)
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
const MovieListSection = ({ title, movieList, hasMore }) => {
  return createDOMElement({
    tag: "section",
    className: "movie-list-section",
    children: [
      createDOMElement({
        tag: "h2",
        textContent: title
      }),
      createDOMElement({
        tag: "ul",
        className: "thumbnail-list",
        children: movieList.map((movie) => MovieItem(movie))
      }),
      hasMore ? createDOMElement({
        tag: "div",
        className: "see-more"
      }) : null
    ]
  });
};
class MovieListView {
  constructor(mainElement) {
    __publicField(this, "mainElement");
    this.mainElement = mainElement;
  }
  clearMainElement() {
    this.mainElement.innerHTML = "";
  }
  renderMovieList({ movieList, hasMore }) {
    const sectionElement = MovieListSection({
      title: "지금 인기 있는 영화",
      movieList,
      hasMore
    });
    this.mainElement.appendChild(sectionElement);
  }
  appendMovieList(movieList) {
    const movieListContainer = this.mainElement.querySelector("ul");
    if (!movieListContainer) return;
    movieList.forEach((movie) => {
      movieListContainer.appendChild(MovieItem(movie));
    });
  }
  getSeeMoreElement() {
    return this.mainElement.querySelector(".see-more");
  }
  handleSeeMoreElement(hasMore) {
    var _a;
    if (!hasMore) (_a = this.mainElement.querySelector(".see-more")) == null ? void 0 : _a.remove();
  }
}
class MovieListController {
  constructor({ mainElement, PopularMovieResults: PopularMovieResults2 }) {
    __publicField(this, "PopularMovieResults");
    __publicField(this, "MovieListView");
    this.PopularMovieResults = PopularMovieResults2;
    this.MovieListView = new MovieListView(mainElement);
  }
  async initialize() {
    this.MovieListView.clearMainElement();
    if (this.PopularMovieResults.hasMovieList()) {
      this.renderStoredMovies();
    } else {
      await this.fetchAndRenderInitialMovies();
    }
    this.observeSeeMore();
  }
  renderStoredMovies() {
    const movieList = this.PopularMovieResults.getMovieList();
    const hasMore = this.PopularMovieResults.hasMore();
    this.MovieListView.renderMovieList({ movieList, hasMore });
  }
  async fetchAndRenderInitialMovies() {
    const { movieList, hasMore } = await this.fetchAndStoreMovies();
    this.MovieListView.renderMovieList({ movieList, hasMore });
  }
  async loadNextMoviePage() {
    const nextPage = this.PopularMovieResults.getPage() + 1;
    const { movieList, hasMore } = await this.fetchAndStoreMovies(nextPage);
    this.MovieListView.appendMovieList(movieList);
    this.MovieListView.handleSeeMoreElement(hasMore);
  }
  async fetchAndStoreMovies(page = 1) {
    const {
      page: newPage,
      total_pages: totalPage,
      results: movieList
    } = await getPopularMovieResult(page);
    this.PopularMovieResults.addMovieList(newPage, movieList);
    this.PopularMovieResults.initialTotalPage(totalPage);
    return { movieList, hasMore: newPage !== totalPage };
  }
  observeSeeMore() {
    const seeMoreElement = this.MovieListView.getSeeMoreElement();
    infinityScrollObserver(seeMoreElement, this.loadNextMoviePage.bind(this));
  }
}
const getSearchMovieResult = async (inputData, page) => {
  const searchResult = await ApiWrapper(
    () => baseApi("/search/movie", {
      query: inputData,
      include_adult: false,
      page
    })
  );
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
        className: "empty-wrapper",
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
class SeacrhMovieListView {
  constructor(mainElement) {
    __publicField(this, "mainElement");
    this.mainElement = mainElement;
  }
  clearMainElement() {
    this.mainElement.innerHTML = "";
  }
  renderMovieList(searchText, { movieList, hasMore }) {
    let sectionElement;
    const existingMovieList = movieList.length !== 0;
    if (existingMovieList) {
      sectionElement = MovieListSection({
        title: `"${searchText}" 검색 결과`,
        movieList,
        hasMore
      });
    } else {
      sectionElement = MovieEmptySection(`"${searchText}" 검색 결과`);
    }
    this.mainElement.appendChild(sectionElement);
  }
  appendMovieList(movieList) {
    const movieListContainer = this.mainElement.querySelector("ul");
    if (!movieListContainer) return;
    movieList.forEach((movie) => {
      movieListContainer.appendChild(MovieItem(movie));
    });
  }
  getSeeMoreElement() {
    return this.mainElement.querySelector(".see-more");
  }
  handleSeeMoreElement(hasMore) {
    var _a;
    if (!hasMore) (_a = this.mainElement.querySelector(".see-more")) == null ? void 0 : _a.remove();
  }
}
class SearchMovieListController {
  constructor(mainElement) {
    __publicField(this, "searchText", "");
    __publicField(this, "page", 0);
    __publicField(this, "searchMovieListView");
    this.searchMovieListView = new SeacrhMovieListView(mainElement);
  }
  async initialize(searchText) {
    this.searchMovieListView.clearMainElement();
    this.searchText = searchText;
    this.page = 0;
    const { movieList, hasMore } = await this.fetchMovies();
    this.searchMovieListView.renderMovieList(this.searchText, { movieList, hasMore });
    this.observeSeeMore();
  }
  async fetchMovies() {
    const {
      page: newPage,
      total_pages: totalPage,
      results: movieList
    } = await getSearchMovieResult(this.searchText, this.page + 1);
    this.page = newPage;
    return { movieList, hasMore: newPage !== totalPage };
  }
  async loadNextMoviePage() {
    const { movieList, hasMore } = await this.fetchMovies();
    this.searchMovieListView.appendMovieList(movieList);
    this.searchMovieListView.handleSeeMoreElement(hasMore);
  }
  observeSeeMore() {
    const seeMoreElement = this.searchMovieListView.getSeeMoreElement();
    infinityScrollObserver(seeMoreElement, this.loadNextMoviePage.bind(this));
  }
}
const BackgroundThumbnailSection = (movie) => {
  return createDOMElement({
    tag: "div",
    className: "background-container",
    children: [
      createDOMElement({
        tag: "div",
        className: "background-thumbnail-wrapper loading",
        children: [
          createDOMElement({
            tag: "img",
            className: "background-thumbnail",
            src: `https://media.themoviedb.org/t/p/w440_and_h660_face${movie.backdrop_path}`,
            alt: movie.title,
            onload: function() {
              var _a;
              (_a = this.parentElement) == null ? void 0 : _a.classList.remove("loading");
            }
          })
        ]
      }),
      createDOMElement({
        tag: "div",
        className: "overlay",
        "aria-hidden": "true"
      }),
      createDOMElement({
        tag: "div",
        className: "top-rated-container",
        children: createDOMElement({
          tag: "div",
          className: "top-rated-movie",
          children: [
            createDOMElement({
              tag: "div",
              className: "rate",
              children: [
                createDOMElement({
                  tag: "img",
                  className: "star",
                  src: "./images/star_empty.png"
                }),
                createDOMElement({
                  tag: "span",
                  className: "rate-value",
                  textContent: Number(movie.vote_average).toFixed(2)
                })
              ]
            }),
            createDOMElement({
              tag: "div",
              className: "title",
              textContent: movie.title
            }),
            createDOMElement({
              tag: "button",
              className: "primary detail",
              textContent: "자세히 보기"
            })
          ]
        })
      })
    ]
  });
};
class BackgroundThumbnailView {
  constructor(mainElement) {
    __publicField(this, "mainElement");
    __publicField(this, "backgroundElement");
    this.mainElement = mainElement;
  }
  renderBackgroundThumbnail(movieItem) {
    this.backgroundElement = BackgroundThumbnailSection(movieItem);
    this.mainElement.insertAdjacentElement("beforebegin", this.backgroundElement);
  }
  getDetailButton() {
    return this.backgroundElement.querySelector("button.detail");
  }
}
class BackgroundThumbnailController {
  constructor({ mainElement, openDetailModal }) {
    __publicField(this, "openDetailModal");
    __publicField(this, "BackgroundThumbnailView");
    this.openDetailModal = openDetailModal;
    this.BackgroundThumbnailView = new BackgroundThumbnailView(mainElement);
  }
  async initialize(movieItem) {
    this.BackgroundThumbnailView.renderBackgroundThumbnail(movieItem);
    this.clickDetailButton(movieItem);
  }
  clickDetailButton(movieItem) {
    const detailButtonElement = this.BackgroundThumbnailView.getDetailButton();
    detailButtonElement.addEventListener("click", () => this.openDetailModal(movieItem.id));
  }
}
class PopularMovieResults {
  constructor() {
    __publicField(this, "movieList", []);
    __publicField(this, "page", 0);
    __publicField(this, "maxPage", 0);
  }
  addMovieList(newPage, list) {
    this.movieList.push(...list);
    this.page = newPage;
  }
  initialTotalPage(totalPage) {
    this.maxPage = totalPage;
  }
  getMovieList() {
    return [...this.movieList];
  }
  getFirstMovieItem() {
    return this.movieList[0];
  }
  getPage() {
    return this.page;
  }
  hasMore() {
    return this.page !== this.maxPage;
  }
  hasMovieList() {
    return this.movieList.length > 0;
  }
}
const filledStar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAKXSURBVHgB7ZhBbtQwFIZ/zyAxu8IN0hNANqh0Q+YG9ASlJyhzgpmeADgBvQG9QbOCJXMDwgnIqoyEqPnjcWmVxElsPU9bKZ/kZuQ4rp/f+/OeA4yMjDxqFCKhvyHh7B+gUWKGhUp5jcATxGPJxb81v67wk39XiMAE8cj+/5riVH/HM0QgigEMn3e8JLcdXPzvOwYJEssDx40ehVNEQFzERrzAj9abU6TqFdYQJIYHls47f6yoBYlhQOa8E0HMogY0xNsYIC9maQ8c944QFrOYiDvFW2eG51KZWdIDy8Ejr/AeQnh7wIhwwzZl+8s2YbvGC/iXCmd8ds1nS85Vcq6qZip9PdNqAMOh2s3ENMUFattUnHKguQAaoYwhBbarLNm3Vq9pdI2GAfZN8hkPEc2q9hAf73ZNWgbtZpdDUM3wahhgLTzDQ0PjE0PovN7tFDFDaQWfN0tMWkLnhs63EI3IsNVDgvtgK+Yj7nzuGtL7GrUJ6hK7N6Jgm3PxRdeg3kRmJ5iz5dgdOXNC2rf4Cq9EthNdVGI9HJ6p/TNxTCM6xOoiqJjTX3kwUfgCWeZdYnURXI3SE1XlmUCGgovfRwBhHrhktp7hFyQJLLHDyukZXkKaTdicYQZo+cN56JyhB5o3kCdoTv/XaIz4vyFAB/4eeBrnE6Eh4ItFSAhlA8cVbCe2FQOfyeBJiAH9scpywNYy56aG3yA1fRJz1/CrhfriX/GQXpUDjow6qLL11IGfB1zxr82he6EOzK7nrser6tJmXPeJz1MHfgao1mSTsz/1KcJoxIqXfT530XI7gwd+BlzzH2rr3u31hIuZD6nb6xhvHOAIdZFPsAcPQsrpBNUuzXAh9XnQzrnipuxxRYuQDRkZGRm5H/4BIkyx5W7xkPAAAAAASUVORK5CYII=";
const ModalImageComponent = (moviePoster, movieTitle) => {
  return createDOMElement({
    tag: "div",
    className: "modal-image loading",
    children: [
      createDOMElement({
        tag: "img",
        src: moviePoster ? `https://media.themoviedb.org/t/p/w440_and_h660_face${moviePoster}` : defaultImage,
        alt: movieTitle,
        onload: function() {
          var _a;
          (_a = this.parentElement) == null ? void 0 : _a.classList.remove("loading");
        }
      })
    ]
  });
};
const RATING_MESSAGE = {
  0: "별점 미등록",
  2: "최악이예요",
  4: "별로예요",
  6: "보통이에요",
  8: "재미있어요",
  10: "명작이에요"
};
const STAR_LENGTH = 5;
const MyStarRatingComponent = (starScore) => {
  return createDOMElement({
    tag: "div",
    className: "my-star",
    children: [
      createDOMElement({
        tag: "div",
        className: "star-wrapper",
        children: starScoreComponent(starScore)
      }),
      createDOMElement({
        tag: "span",
        className: "star-description-ment",
        children: [
          createDOMElement({
            tag: "div",
            className: "rating-ment",
            textContent: RATING_MESSAGE[starScore]
          }),
          createDOMElement({
            tag: "div",
            className: "rating-number",
            textContent: starScore ? `(${starScore}/10)` : ""
          })
        ]
      })
    ]
  });
};
const starScoreComponent = (starScore) => {
  if (starScore) {
    return Array.from(
      { length: STAR_LENGTH },
      (_, index) => createDOMElement({
        tag: "img",
        src: starScore > 0 && index < starScore / 2 ? "./images/star_filled.png" : "./images/star_empty.png"
      })
    );
  }
  return Array.from(
    { length: STAR_LENGTH },
    () => createDOMElement({
      tag: "img",
      src: "./images/star-empty.png"
    })
  );
};
const ModalDescriptionComponent = (movieItem) => {
  return createDOMElement({
    tag: "div",
    className: "modal-description",
    children: [
      // 첫 번째 섹션
      MovieInfoSectionComponent(movieItem),
      // 두 번째 섹션 (내 별점)
      MyStarRatingSectionComponent(movieItem),
      // 세 번째 섹션 (줄거리)
      OverviewSectionComponent(movieItem.overview)
    ]
  });
};
const MovieInfoSectionComponent = (movieItem) => {
  return createDOMElement({
    tag: "div",
    className: "description-section description-first-section",
    children: [
      createDOMElement({
        tag: "h2",
        className: "movie-title",
        textContent: movieItem.title
      }),
      createDOMElement({
        tag: "p",
        className: "category",
        textContent: "2024 · 모험, 애니메이션, 코미디, 드라마, 가족"
      }),
      createDOMElement({
        tag: "div",
        className: "rate",
        children: [
          createDOMElement({
            tag: "span",
            className: "average",
            textContent: "평균"
          }),
          createDOMElement({
            tag: "div",
            className: "rate-star",
            children: [
              createDOMElement({
                tag: "img",
                className: "star",
                src: "./images/star_filled.png"
              }),
              createDOMElement({
                tag: "span",
                className: "star-description",
                textContent: Number(movieItem.vote_average).toFixed(2)
              })
            ]
          })
        ]
      })
    ]
  });
};
const MyStarRatingSectionComponent = (movieItem) => {
  return createDOMElement({
    tag: "div",
    className: "description-section description-second-section",
    children: [
      createDOMElement({
        tag: "span",
        className: "description-title",
        textContent: "내 별점"
      }),
      MyStarRatingComponent("starScore" in movieItem ? movieItem.starScore : 0)
    ]
  });
};
const OverviewSectionComponent = (overview) => {
  return createDOMElement({
    tag: "div",
    className: "description-section description-third-section",
    children: [
      createDOMElement({
        tag: "span",
        className: "description-title",
        textContent: "줄거리"
      }),
      createDOMElement({
        tag: "p",
        className: "detail",
        textContent: overview ? overview : "줄거리가 없습니다."
      })
    ]
  });
};
const CloseButton = () => {
  return createDOMElement({
    tag: "form",
    method: "dialog",
    children: [
      createDOMElement({
        tag: "button",
        className: "close-modal",
        id: "closeModal",
        children: [
          createDOMElement({
            tag: "img",
            src: "./images/modal_button_close.png"
          })
        ]
      })
    ]
  });
};
const DetailModal = (movieItem) => {
  return createDOMElement({
    tag: "dialog",
    className: "detail-modal-container",
    children: [
      createDOMElement({
        tag: "div",
        className: "modal",
        children: [
          CloseButton(),
          createDOMElement({
            tag: "div",
            className: "modal-container",
            id: movieItem.id,
            children: [
              // Left Image
              ModalImageComponent(movieItem.poster_path, movieItem.title),
              // Right Description
              ModalDescriptionComponent(movieItem)
            ]
          })
        ]
      })
    ]
  });
};
const emptyStar = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAQ4SURBVHgB7VlNctMwFP7UwrRl0/YGzgloNwyURd0TQE5AeoK2J2hyAuAEaU9QOEHMgvCzSW9QcwLChqbDNOI9RVEk106sWGZY5JvR+FlRJD29fxlYYYX/F/I79uQXxKgRAjWANh3Ro0ct0l0ptSPxQj2DYg31oIvZ5qHpLmpAcAno07+ZdWBIq+zoN5ZCgoCoQwLnhhK4oBUS8y7xGoFRhwT49CP9eqSfPb3aEBtoiH16BkJQCdDmW7AMl9VFq0w6GUCqdKvGBENoFXpj0R2LvjSUwCsERDAGtPHGVldiqBHeWf0xxwcEQkgJOMZr+3xxpHQ+Mb//CWfMIRmIDSUtlZlhplLrOJED41orIQgDecabHaP6pPY+E2OOEQChJFBkvC4E3lv0CQIgNw4o8Y6UiCNicQdjanxqQrVtQ0s9xk0bGkU5j+zR+E38tFa/1pF6aD1/GXrqfteJfkySzYkfImfjV8CS4mXjfY7jeUNkn+YXSxvxBR3Amc3II+fnEd4CS+tmQlH2bOGoO2JwC8umFS3aI8MckiuBPol3lnilqs3EyfjxQORjak/yxTsPStq/tYraKikMvY2pak769/SOhyTl3ek8j+aswb68g5qgGb4uM1Z+oxgzzg9+rheyvQTQll9xFcpfLwNeW9nMGG2r+4M9xmWAQ760BrCejjDQacI/hVqT1nYMXtDeMnYmCv7chp0asC2soymelRN5VcjPpC5ryhtGpnOMjnjpSEIhN5CR7reJNZvTCPckiT5OUTNIbU9oVwPYm5fkOnM2z5hb0OSeBNlGXcatjbVtdaX03qTNF0p+YUWWc8Mw1cXjUJWVchS3VPS7+s5RurnoJqNUSalSgI3MAnw6m9ivyoSO/lmVuaRgd1pm7lLJHOfz4gBNuIlaFKQ8HKlDicw7G+sBWmUPxisbVcYtrVixhqeojtiiO0XGWgT/dFqoED+BpNSiOlJrPu+g6c+AdEJ6gupIDLVEwe91L5S9dSOVqnyvpB3EjUkiN7Hr4xj8JBD+9CcFv7D8/MgvzfZjwBXxp0XDPa7XZ3NJvysXXxuILTopGsSbppRgwOkHvfb4unFBQpgYytMOSuuwo/+ZosKM4aB0R+mALMiZJGW7lLLnRddMMdUo+y3BRwKxtZEHuYlSFY6o9ualrtymEOq3nr6GcSGcOWOUhA8Dh5ht7KMhSTLUOFdy8yVWC4F91eBcdPGYLv2n66iVNSf95xAlsZwE9Gmp1FcqPY+tjQxpVk7C1Ccl3VqYFOKpNR/39UyKbktAlpeAjw1I65Xv/c+RFTWnGVuUbhf4cX3ibbgXYYxUzSlVBeZlBz4M9FCsmym147Kfj9Tt9P2DOiOLUgz4qFCnsJ/Tao9vX1ya0vjGnDnTsl7IL5XoU5Sc3GlGyhNR2Vn106lSK6lu66YBLEVNn2RrBZevqoRdYYUVvPAXJrOCc9SFL6sAAAAASUVORK5CYII=";
class DetailModalView {
  constructor(mainElement) {
    __publicField(this, "mainElement");
    __publicField(this, "detailModalElement");
    this.mainElement = mainElement;
  }
  renderDetailModal(movieItem) {
    var _a;
    if ((_a = this.detailModalElement) == null ? void 0 : _a.isConnected) {
      this.detailModalElement.remove();
    }
    this.detailModalElement = DetailModal(movieItem);
    this.mainElement.insertAdjacentElement("afterend", this.detailModalElement);
  }
  show() {
    this.detailModalElement.showModal();
  }
  getDetailModalElement() {
    return this.detailModalElement;
  }
  getMovieIdFromModal() {
    const modalContainer = this.detailModalElement.querySelector(".modal-container");
    return Number(modalContainer == null ? void 0 : modalContainer.id);
  }
  getClickedStarIndex(target) {
    const allStars = Array.from(this.detailModalElement.querySelectorAll(".star-wrapper img"));
    return allStars.indexOf(target);
  }
  updateStars(clickedIndex, isActive) {
    const allStars = Array.from(this.detailModalElement.querySelectorAll(".star-wrapper img"));
    allStars.forEach((img, index) => {
      if (isActive) {
        img.setAttribute("src", index >= clickedIndex ? emptyStar : img.getAttribute("src"));
      } else {
        img.setAttribute("src", index <= clickedIndex ? filledStar : emptyStar);
      }
    });
    return allStars.filter((img) => img.getAttribute("src") === filledStar).length * 2;
  }
  updateRatingText(score) {
    const ratingMent = this.detailModalElement.querySelector(".star-description-ment .rating-ment");
    const ratingNumber = this.detailModalElement.querySelector(
      ".star-description-ment .rating-number"
    );
    ratingMent.textContent = RATING_MESSAGE[score];
    ratingNumber.textContent = score === 0 ? "" : `(${score}/10)`;
  }
}
class DetailModalController {
  constructor({ mainElement, updateStarScore }) {
    __publicField(this, "updateStarScore");
    __publicField(this, "detailModalView");
    this.updateStarScore = updateStarScore;
    this.detailModalView = new DetailModalView(mainElement);
  }
  initialize(movieItem) {
    this.detailModalView.renderDetailModal(movieItem);
    this.bindEvents();
    this.detailModalView.show();
    document.body.style.overflowY = "hidden";
  }
  bindEvents() {
    const detailModal = this.detailModalView.getDetailModalElement();
    detailModal.addEventListener("close", () => {
      document.body.style.overflowY = "scroll";
    });
    detailModal.addEventListener("click", (event) => {
      const target = event.target;
      if (target === event.currentTarget) {
        detailModal.close();
        document.body.style.overflowY = "scroll";
        return;
      }
      if (target.closest(".star-wrapper")) {
        const score = this.handleStarClick(target);
        const movieId = this.detailModalView.getMovieIdFromModal();
        this.updateStarScore(movieId, score);
      }
    });
  }
  handleStarClick(target) {
    const index = this.detailModalView.getClickedStarIndex(target);
    const allStars = this.detailModalView.getDetailModalElement().querySelectorAll(".star-wrapper img");
    const isActive = allStars[index].getAttribute("src") === filledStar;
    const score = this.detailModalView.updateStars(index, isActive);
    this.detailModalView.updateRatingText(score);
    return score;
  }
}
const getDetailMovieResult = async (id) => {
  const movieResult = await ApiWrapper(() => baseApi(`/movie/${id}`));
  return movieResult;
};
class DetailMovieResults {
  constructor() {
    __publicField(this, "detailMovieResults", []);
    const detailMovieResults = localStorage.getItem("detailMovieResults");
    if (detailMovieResults) {
      this.detailMovieResults = JSON.parse(detailMovieResults);
    }
  }
  async getDetailMovieResultById(id) {
    const movieItem = this.detailMovieResults.find((movie) => movie.id === id);
    if (movieItem) {
      return movieItem;
    } else {
      const movieItem2 = await getDetailMovieResult(id);
      this.addDetailMovieResult({
        id: movieItem2.id,
        poster_path: movieItem2.poster_path,
        overview: movieItem2.overview,
        title: movieItem2.title,
        vote_average: Number(Number(movieItem2.vote_average).toFixed(2)),
        starScore: 0
      });
      return movieItem2;
    }
  }
  addDetailMovieResult(movieItem) {
    this.detailMovieResults.push(movieItem);
    this.updateLocalStorage();
  }
  updateStarScore(id, score) {
    const targetMovie = this.detailMovieResults.find((movie) => movie.id === id);
    if (targetMovie) {
      targetMovie.starScore = score;
    }
    this.updateLocalStorage();
  }
  // 로컬스토리지 업데이트
  updateLocalStorage() {
    localStorage.setItem("detailMovieResults", JSON.stringify(this.detailMovieResults));
  }
}
const MovieItemOpenHandler = (element, openModal) => {
  element.addEventListener("click", (event) => {
    const target = event.target;
    const item = target.closest("div.item");
    if (item) openModal(Number(item.id));
  });
};
const Spinner = () => {
  return createDOMElement({
    tag: "div",
    className: "spinner-wrapper",
    children: createDOMElement({
      tag: "div",
      className: "orbit-spinner",
      children: [
        createDOMElement({
          tag: "div",
          className: "planet"
        }),
        createDOMElement({
          tag: "div",
          className: "orbit",
          children: [
            createDOMElement({
              tag: "div",
              className: "satellite satellite-1"
            }),
            createDOMElement({
              tag: "div",
              className: "satellite satellite-2"
            })
          ]
        })
      ]
    })
  });
};
class SpinnerController {
  constructor() {
    __publicField(this, "spinnerElement");
    this.spinnerElement = Spinner();
  }
  initialize() {
    this.render();
    this.bindEvents();
  }
  render() {
    document.body.appendChild(this.spinnerElement);
  }
  bindEvents() {
    eventEmitter.on("loading:start", () => {
      this.spinnerElement.classList.add("active");
    });
    eventEmitter.on("loading:end", () => {
      this.spinnerElement.classList.remove("active");
    });
  }
}
class MainController {
  constructor() {
    __publicField(this, "mainElement");
    __publicField(this, "PopularMovieResults");
    __publicField(this, "detailMovieResults");
    __publicField(this, "spinnerController");
    __publicField(this, "headerController");
    __publicField(this, "messageModalController");
    __publicField(this, "movieListController");
    __publicField(this, "backgroundThumbnailController");
    __publicField(this, "detailModalController");
    __publicField(this, "searchMovieListController");
    this.mainElement = document.querySelector("main");
    this.PopularMovieResults = new PopularMovieResults();
    this.detailMovieResults = new DetailMovieResults();
    this.initController();
  }
  initController() {
    this.spinnerController = new SpinnerController();
    this.messageModalController = new MessageModalController();
    this.detailModalController = new DetailModalController({
      mainElement: this.mainElement,
      updateStarScore: (id, score) => this.detailMovieResults.updateStarScore(id, score)
    });
    this.movieListController = new MovieListController({
      mainElement: this.mainElement,
      PopularMovieResults: this.PopularMovieResults
    });
    this.backgroundThumbnailController = new BackgroundThumbnailController({
      mainElement: this.mainElement,
      openDetailModal: (id) => this.openDetailModal(id)
    });
    this.searchMovieListController = new SearchMovieListController(this.mainElement);
    this.headerController = new HeaderController({
      renderSearchMovieList: (searchValue) => this.searchMovieListController.initialize(searchValue),
      renderMovieList: () => this.movieListController.initialize()
    });
  }
  async render() {
    this.spinnerController.initialize();
    this.messageModalController.initialize();
    this.headerController.initialize();
    await this.movieListController.initialize();
    await this.backgroundThumbnailController.initialize(this.PopularMovieResults.getFirstMovieItem());
    MovieItemOpenHandler(this.mainElement, this.openDetailModal.bind(this));
  }
  async openDetailModal(id) {
    const movieItem = await this.detailMovieResults.getDetailMovieResultById(id);
    this.detailModalController.initialize(movieItem);
  }
}
const main = new MainController();
main.render();
