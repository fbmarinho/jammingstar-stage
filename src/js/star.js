class Star {
  imageSources = {
    disc: "./assets/scales/cromatic/disc.png",
    mask: "./assets/scales/cromatic/mask.png",
    star: "./assets/scales/cromatic/star.png",
    note: "./assets/scales/cromatic/noteon.png",
  };

  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.angle = 0;
    this.drawable = false;
    this.#load();
  }
  draw(ctx) {
    if (this.drawable) {
      ctx.drawImage(this.images.disc, this.x, this.y, this.w, this.h);
      ctx.drawImage(this.images.mask, this.x, this.y, this.w, this.h);
      ctx.drawImage(this.images.star, this.x, this.y, this.w, this.h);

      ctx.save();

      ctx.translate(this.w / 2, this.h / 2);
      ctx.rotate((60 * Math.PI) / 180);

      ctx.drawImage(this.images.note, -this.w / 2, -this.h / 2, this.w, this.h);

      ctx.restore();
    }
  }

  async #load() {
    this.images = await this.#loadAllImages();
  }

  #loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  async #loadAllImages() {
    console.log("Loading images...");
    const entries = await Promise.all(
      Object.entries(this.imageSources).map(async ([key, src]) => {
        const img = await this.#loadImage(src);
        return [key, img];
      })
    );
    this.drawable = true;
    console.log("Finish loading images");
    return Object.fromEntries(entries);
  }
}

export default Star;
