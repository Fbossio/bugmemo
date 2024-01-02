import { randomUUID } from 'crypto';

export class Bug {
  _id: string;
  title: string;
  user: string;
  status?: BugStatus;
  description?: string;
  tags?: string[];
  bugImages?: string[];
  bugFix?: string;
  fixLinks?: string[];
  fixImages?: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(
    title: string,
    user: string,
    status?: BugStatus.OPEN,
    description?: string,
    tags?: string[],
    bugImages?: string[],
    bugFix?: string,
    fixLinks?: string[],
    fixImages?: string[],
  ) {
    this._id = randomUUID();
    this.title = title;
    this.user = user;
    this.status = status;
    this.description = description;
    this.tags = tags;
    this.bugImages = bugImages;
    this.bugFix = bugFix;
    this.fixLinks = fixLinks;
    this.fixImages = fixImages;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  static createFromData(data: Partial<Bug>) {
    const bug = new Bug('', '');
    bug._id = data._id;
    bug.title = data.title;
    bug.user = data.user;
    bug.status = data.status;
    bug.description = data.description;
    bug.tags = data.tags;
    bug.bugImages = data.bugImages;
    bug.bugFix = data.bugFix;
    bug.fixLinks = data.fixLinks;
    bug.fixImages = data.fixImages;
    bug.createdAt = data.createdAt;
    bug.updatedAt = data.updatedAt;
    return bug;
  }

  updateDate() {
    this.updatedAt = new Date();
  }

  updateStatus(status: BugStatus) {
    this.status = status;
  }

  private removeElementFromArray(array: string[], element: string): string[] {
    return array.filter((e) => e !== element);
  }

  removeTag(tag: string) {
    if (this.tags && this.tags.length > 0) {
      this.tags = this.removeElementFromArray(this.tags, tag);
    }
  }

  removeBugImage(image: string) {
    if (this.bugImages && this.bugImages.length > 0) {
      this.bugImages = this.removeElementFromArray(this.bugImages, image);
    }
  }

  removeFixLink(link: string) {
    if (this.fixLinks && this.fixLinks.length > 0) {
      this.fixLinks = this.removeElementFromArray(this.fixLinks, link);
    }
  }

  removeFixImage(image: string) {
    if (this.fixImages && this.fixImages.length > 0) {
      this.fixImages = this.removeElementFromArray(this.fixImages, image);
    }
  }
}

export enum BugStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}
