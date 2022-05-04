type User = {
  id: string;
  name: string;
  image: string;
  emailVerified: null|string;
  email: string;
  papers?: string[]
}

type PaperData = {
  uid: string;
  userId: string;
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

type CompletedPaper = {
  posts: PostData[];
  isCompleted: boolean;
}
