
import {useState} from "react";
import {FaSearch} from "react-icons/fa";
import {useParams, useNavigate} from "react-router-dom";

export default function SearchBar() {
    const navigate = useNavigate();
    const {keyword: urlKeyword} = useParams();
    const [keyword, setKeyword] = useState<string>(urlKeyword || "");

    const handleSearchHandler = (e: any) => {
        e.preventDefault();
        if (keyword.trim()) {
            setKeyword("");
            navigate(`/projects/search/${keyword}`);
        } else {
            navigate("/");
        }
    }

    return (
        <>
            <div className={"flex justify-center items-center p-4"}>
                <form className={"mx-auto"}
                      onSubmit={handleSearchHandler}>
                    <div className={"relative w-full max-w-md"}>
                        <input
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder={"Search..."}
                            className={"w-full px-4 py-2 pr-20 rounded-full text-black  focus:outline-none focus:ring-2 focus:ring-gray-500"}/>
                        <button
                            className={"absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-900 "}>
                            <FaSearch/>
                        </button>
                    </div>
                </form>
            </div>
        </>
    )

}