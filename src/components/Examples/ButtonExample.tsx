import Button from "../Button/Button";
import { useFetch } from "../../hooks/useFetch";

export default function ButtonExample() {
  const { makeReq, isLoading, isSuccess, error } = useFetch()

  const fetchPosts = async ({ id }: { id: number }) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`)
    if (res.status !== 200) throw new Error("Произошла ошибка")
    const data = await res.json()

    console.log(data)
  }

  console.log(error)
  const handleClick = () => {
    makeReq(
      fetchPosts({ id: 2 })
    )
  }

  return (
    <div>
      <Button {...{ isLoading, isSuccess }} onClick={handleClick}>
        button
      </Button>
    </div>
  );
}
