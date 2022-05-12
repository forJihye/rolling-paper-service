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
  key: string;
  name: string;
  message: string;
  initDate: string;
  updateDate: string;
}

type CompletedPaper = {
  posts: PostData[];
  isCompleted: boolean;
}

type UserPapers = PaperData[] | null;