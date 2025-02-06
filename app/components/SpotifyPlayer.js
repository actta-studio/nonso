import axios from "axios";
import Component from "../classes/Component";
import Airtable from "airtable";
import gsap from "gsap";

export default class SpotifyPlayer extends Component {
  constructor() {
    super({
      id: "spotify-player",
      element: "#spotify-player",
      elements: {
        title: "#spotify-player .title",
        coverArt: "#spotify-player .cover-art",
        vinyl: "#spotify-player .vinyl",
      },
    });

    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: import.meta.env.VITE_AIRTABLE_PAT,
    });

    this.base = Airtable.base(import.meta.env.VITE_AIRTABLE_BASE_ID);

    this.init();
  }

  async getNewToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN);

    const encoded = btoa(
      `${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${
        import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
      }`
    );

    const headers = {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      params,
      { headers }
    );

    return res;
  }

  async updateToken() {
    const res = await this.getNewToken();
    const { access_token, expires_in } = res.data;

    const created = Date.now();
    const token = {
      token: access_token,
      expires: (expires_in - 300) * 1000,
      created,
    };

    this.token = token;

    this.base("token").update(
      [
        {
          id: "recqE1aukcial9KAW",
          fields: {
            token: access_token,
            expiry: (expires_in - 300) * 1000,
            created,
          },
        },
      ],
      function (err, records) {
        if (err) {
          console.error(err);
          return;
        }
      }
    );
  }

  async init() {
    try {
      const tokenValid = (token = {}) => {
        const now = Date.now();
        const expiry = Number(token.created) + Number(token.expires);

        return now < expiry;
      };

      const res = await this.base("token").select().firstPage();
      this.token = res[0].fields;

      if (this.token && !tokenValid(this.token)) {
        await this.updateToken();
      }
      if (!this.token) {
        await this.updateToken();
      }

      const playing = await this.getNowPlaying();
      this.setNowPlaying(playing);
    } catch (error) {
      if (error.response) {
        if (error.response.data.error.message === "The access token expired") {
          await this.updateToken();
          const playing = await this.getNowPlaying();
          this.setNowPlaying(playing);
        }
      }
    }
  }

  async getNowPlaying() {
    let songName = "";
    let isPlaying = false;
    let artistName = "";
    let url = "";
    let coverImageUrl = "";

    const headers = {
      Authorization: `Bearer ${this.token.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const res = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      { headers }
    );

    if (
      res.data.is_playing === false ||
      res.data.currently_playing_type !== "track"
    ) {
      const res = await axios.get(
        "https://api.spotify.com/v1/me/player/recently-played?limit=1",
        { headers }
      );

      const playHistory = res.data.items;
      const recentTrack = playHistory[0].track;

      songName = recentTrack.name;
      isPlaying = false;
      artistName = recentTrack.artists[0].name;
      url = recentTrack.external_urls.spotify;
      coverImageUrl = recentTrack.album.images[0].url;
    } else {
      const track = res.data.item;

      songName = track.name;
      isPlaying = res.data.is_playing;
      artistName = track.artists[0].name;
      url = track.external_urls.spotify;
      coverImageUrl = track.album.images[0].url;
    }

    return {
      artistName,
      isPlaying,
      songName,
      url,
      coverImageUrl,
    };
  }

  setNowPlaying(playing) {
    if (playing.isPlaying) {
      const coverArtElement = this.elements
        .get("coverArt")
        .querySelector("img");

      coverArtElement.src = playing.coverImageUrl;
      coverArtElement.alt = `${playing.songName} by ${playing.artistName}`;

      this.elements.get("vinyl").querySelector("img").src = this.elements
        .get("vinyl")
        .querySelector("img")
        .getAttribute("data-active");

      const marqueeParts = this.elements
        .get("title")
        .querySelectorAll(".marquee__part");
      marqueeParts.forEach((part) => {
        part.innerHTML = `${playing.artistName} - ${playing.songName}`;
        part.setAttribute(
          "data-text",
          `${playing.artistName} - ${playing.songName}`
        );
      });

      this.initMarquee();
    } else {
      const coverArtElement = this.elements
        .get("coverArt")
        .querySelector("img");

      coverArtElement.src = "no-song.png";
      coverArtElement.alt = `No song playing`;

      this.elements.get("vinyl").querySelector("img").src = this.elements
        .get("vinyl")
        .querySelector("img")
        .getAttribute("data-idle");

      const marqueeParts = this.elements
        .get("title")
        .querySelectorAll(".marquee__part");
      marqueeParts.forEach((part) => {
        part.innerHTML = "No track playing... it feels a little lonely.";
        part.setAttribute(
          "data-text",
          "No track playing... it feels a little lonely."
        );
      });

      this.initMarquee();
    }

    this.element.classList.remove("hidden");
  }

  initMarquee() {
    // Clean up previous animation and event listeners if they exist
    this.cleanupMarquee();

    let isScrollingDown = true;

    this.tween = gsap
      .to(".marquee__part", {
        xPercent: -100,
        repeat: -1,
        duration: 10,
        ease: "linear",
      })
      .totalProgress(0.5);

    gsap.set(".marquee__inner", { xPercent: -50 });

    gsap.to(this.tween, {
      timeScale: isScrollingDown ? 1 : -1,
    });

    this.mouseEnterHandler = () => {
      gsap.to(this.tween, { timeScale: 3 });
    };

    this.mouseLeaveHandler = () => {
      gsap.to(this.tween, { timeScale: 1 });
    };

    this.element.addEventListener("mouseenter", this.mouseEnterHandler);
    this.element.addEventListener("mouseleave", this.mouseLeaveHandler);
  }

  async onChange() {
    await this.cleanupMarquee();
    const playing = await this.getNowPlaying();
    this.setNowPlaying(playing);
  }

  cleanupMarquee() {
    if (this.tween) {
      this.tween.kill();
      this.tween = null;
    }
    if (this.mouseEnterHandler) {
      this.element.removeEventListener("mouseenter", this.mouseEnterHandler);
      this.mouseEnterHandler = null;
    }
    if (this.mouseLeaveHandler) {
      this.element.removeEventListener("mouseleave", this.mouseLeaveHandler);
      this.mouseLeaveHandler = null;
    }
  }

  removeEventListeners() {
    this.cleanupMarquee();
  }
}
