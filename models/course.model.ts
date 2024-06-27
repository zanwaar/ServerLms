import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IComment extends Document {
  find(arg0: (item: any) => boolean): unknown;
  push(newQuestion: any): unknown;
  user: object;
  question: string;
  questionReplies?: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating: number;
  comment: string;
  commentReplies: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  vidioThumbnail: object;
  vidioSection: string;
  vidioLength: number;
  vidioPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment;
}

interface ICourse extends Document {
  _id: string;
  name: string;
  description: string;
  price: number;
  estimatedPrice?: number;
  thumbnal: object;
  tags: string;
  level: string;
  demoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  ratings?: number;
  puschased?: number;
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
  commentReplies: [Object],
});
const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});
const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: [Object],
});

const coureDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  title: String,
  vidioSection: String,
  description: String,
  vidioLength: Number,
  vidioPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    estimatedPrice: {
      type: Number,
    },
    thumbnal: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    tags: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
    },
    benefits: [{ title: String }],
    prerequisites: [{ title: String }],
    reviews: [reviewSchema],
    courseData: [coureDataSchema],
    ratings: {
      type: Number,
      default: 0,
    },
    puschased: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const CourseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default CourseModel;
