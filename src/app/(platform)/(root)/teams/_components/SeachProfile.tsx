"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { user } from "@/constants/index";

const SearchProfile = ({ username }: { username: string }) => {
  const [userInfo, setUserInfo] = useState(user);

  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [error, setError] = useState(null);
  const [load, setLoad] = useState(true);

  const handleFriendRequest = async (e) => {
    if (isFriend || isRequested) {
      const confirm = window.confirm("Do you really want to remove!");

      if (!confirm) {
        return;
      }
    }

    try {
      const response = await axios.post("/api/request/friend/make-request", {
        requestedUserId: username,
      });
      const { alreadyFriends, alreadyRequested } = response.data;
      setIsFriend(alreadyFriends);
      setIsRequested(alreadyRequested);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await axios
          .get("/api/search/player", {
            params: { username },
          })
          .catch((err) => {
            setLoad(false);
            setError(err);
            console.error(err);
          });
        const { selfSearch } = response1.data;
        if (selfSearch) {
          router.push("/profile");
        }

        const response2 = await axios.get("/api/request/status", {
          params: { username },
        });

        const alreadyFollwing = response2.data.alreadyFollowing;
        const alreadyFriends = response2.data.alreadyFriends;
        const alreadyRequested = response2.data.alreadyRequested;

        if (alreadyFollwing) {
          setIsFollowing(true);
        }

        if (alreadyFriends) {
          setIsFriend(true);
        }

        if (alreadyRequested) {
          setIsRequested(true);
        }
      } catch (err) {
        setLoad(false);
        setError(err);
        throw new Error("Error occured while fetching data");
      }
      setLoad(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {load ? (
        <div className="top-1/2 left-1/2 flex h-screen items-center justify-center">
          <Spinner />
        </div>
      ) : !userInfo?.username ? (
        <div className="top-1/2 left-1/2 flex h-screen w-full flex-col items-center justify-center bg-black text-white">
          <h1>Page not found</h1>
          <button
            className="btn btn-light"
            onClick={() => {
              router.back();
            }}
          >
            Back
          </button>
        </div>
      ) : (
        <div className="container">
          <div className="main-body p-2">
            <div className="row gutters-sm">
              <div className="col-md-4 relative mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column relative items-center text-center">
                      <img
                        src={
                          userInfo.avatar || "https://bootdey.com/img/Content/avatar/avatar7.png"
                        }
                        alt="Admin"
                        className={`rounded-circle`}
                        width="150"
                      />
                      <div className="mt-3 flex flex-col items-center">
                        <h4>{userInfo.username || "Username"}</h4>
                        <div className="flex w-full items-center justify-between">
                          <Follow userInfo={userInfo} username={username} />
                          <div className="w-full">
                            <button
                              className="primary-btn btn-outline-primary flex items-center gap-2 border-1 border-blue-600 px-3 text-blue-600 hover:bg-blue-600 hover:text-white active:bg-blue-600 active:text-white"
                              onClick={handleFriendRequest}
                            >
                              {isFriend ? "Friend" : isRequested ? "Requested" : "Add"}
                            </button>
                          </div>
                        </div>
                        <div className="my-2 flex gap-4 text-base">
                          <span className="rounded-md p-2 font-semibold">
                            Following• {userInfo?.following.length}
                          </span>
                          <span className="rounded-m p-2 font-semibold">
                            Followers• {userInfo?.followers.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute z-30 hidden">
                  <input type="file" itemType="image" />
                </div>
              </div>
              <div className="col-md-8">
                <div className="card mb-3">
                  <div>
                    <div className="card-body">
                      <h3 className="mb-4 text-center">{userInfo.username || "username"}</h3>
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Full Name</h6>
                        </div>
                        <div className="col-sm-9 text-secondary">
                          {userInfo.fullName || "Full Name"}
                        </div>
                      </div>
                      <hr />
                      <div className="row">
                        <div className="col-sm-3">
                          <h6 className="mb-0">Email</h6>
                        </div>
                        <div className="col-sm-9 text-secondary outline-none">
                          {userInfo.email || "abcd@your-email.com"}
                        </div>
                      </div>
                      <hr />
                      {userInfo.phone ? (
                        <div className="row">
                          <div className="col-sm-3">
                            <h6 className="mb-0">Phone</h6>
                          </div>
                          <div className="col-sm-9 text-secondary">
                            {userInfo.phone || "123-456-7890"}
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          <div className="col-sm-3">
                            <div className="text-secondary mb-0">Phone</div>
                          </div>
                          <h6 className="col-sm-9">No contact no.</h6>
                        </div>
                      )}

                      <div className="row">
                        <div className="col-sm-12"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row gutters-sm">
                  <div className="col-sm-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center mb-3">Matches Analytics</h6>
                        <h4 className="text-center">Total Match</h4>
                        <small>Won</small>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${userInfo.won || "0"}` }}
                          ></div>
                        </div>
                        <small>Lose</small>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${userInfo.lose || "0"}` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6 mb-3">
                    <div className="card h-100">
                      <div className="card-body">
                        <h6 className="d-flex align-items-center mb-3">Tournament Analytics</h6>
                        <h4 className="text-center">Total Tournaments</h4>
                        <small>Won</small>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${userInfo.titlesWon || "0"}` }}
                          ></div>
                        </div>
                        <small>Lose</small>
                        <div
                          className="progress"
                          role="progressbar"
                          aria-label="Basic example"
                          aria-valuenow="100"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <div
                            className="progress-bar"
                            style={{ width: `${userInfo.titlesLose || "0"}` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchProfile;
