import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img className="max-w-100 rounded" src={"/chess.jpg"} />
          </div>
          <div className="p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-white">
              Play Chess Online on the #3 Site!
            </h1>
            <div className="mt-20">
              <Button
                customStyle="px-10 py-2"
                onClick={() => navigate("/game")}
              >
                Play Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
