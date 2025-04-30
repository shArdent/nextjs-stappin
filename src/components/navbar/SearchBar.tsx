import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const SearchBar = () => {
    return (
        <div className="relative w-full">
            <Input
                className="h-12 w-full rounded border-none bg-white shadow-md"
                placeholder="cari komponen"
            />
            <Button
                variant={"secondary"}
                className="absolute top-[50%] right-3 translate-y-[-50%]"
            >
                <Search />
            </Button>
        </div>
    );
};

export default SearchBar;
