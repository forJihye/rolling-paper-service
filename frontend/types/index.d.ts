type User = {
  image: string;
  name: string;
  emailVerified: null|string;
  email: string;
  id: string;
}

type PaperData = {
  uid: string;
  userName: number;
  friendName: string;
  friendBirth: string;
  completedUid: string;
  isCompleted: boolean;
  posts: PostData[];
}

type PostData = {
  name: string;
  message: string;
}

type PostsData = {
  posts: PostData[];
  isCompleted: boolean;
}