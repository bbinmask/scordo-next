import UserProps from "@/types/user.props";
import Link from "next/link";

const SearchResults = ({
  results,
  userInfo,
  handleFollow,
  handleUnfollow,
}: {
  results: UserProps[];
  userInfo: UserProps;
  handleFollow: (id: string) => void;
  handleUnfollow: (id: string) => void;
}) =>
  results.map((user: UserProps) => (
    <li
      key={user.id}
      className="mb-3 flex items-center justify-between rounded-md border-1 p-3 text-black no-underline"
    >
      <Link href={`/${user.username}`} className="flex items-center gap-4">
        <div className="">
          <img
            src={user.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png"}
            className="h-14 w-14 rounded-full lg:h-16 lg:w-16"
          />
        </div>
        <div className="">
          <span className="hover:tex-blue-600 text-xl font-semibold text-blue-500 active:text-blue-600">
            {user.username}
          </span>
          <div className="mb-15">
            <ul className="m-0 p-0 text-xs">
              <li className="">{user.name}</li>
              {/* <li className="">{user.won}% winning</li> */}
            </ul>
          </div>
        </div>
      </Link>
      {userInfo?.id === user.id ? (
        ""
      ) : (
        <div>
          {userInfo.following.includes(user.id) ? (
            <button onClick={() => handleUnfollow(user.id)} className={`btn btn-secondary`}>
              Unfollow
            </button>
          ) : (
            <button onClick={() => handleFollow(user.id)} className={`btn btn-primary`}>
              Follow
            </button>
          )}
        </div>
      )}
    </li>
  ));

export default SearchResults;
