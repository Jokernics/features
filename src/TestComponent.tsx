import { FC, memo, useEffect, useState } from "react"

type Message = {
  id: string
  str: string
}
const mesageMapDefault: Map<string, Message> = new Map()

mesageMapDefault.set('1', {id: '1', str: '1'})
mesageMapDefault.set('2', {id: '2', str: '2'})
mesageMapDefault.set('3', {id: '3', str: '3'})
mesageMapDefault.set('4', {id: '4', str: '4'})


const MessageComponent: FC<Message> = memo(({str, id}) => {
  console.log('rerender' ,id)
  useEffect(() => {
    return () => {
      console.log('unmount',id)
    }
  }, [])
  
  return <div>{str}</div>
})

export const TestComponent = () => {
  const [messagesMap, setMessagesMap] = useState<Map<string, Message>>(mesageMapDefault)
  
  const array = Array.from(messagesMap.values())
  console.log(array)
  
    return <div className='flex flex-col gap-2'>
      <button onClick={() => {
        const temporary = messagesMap.get('4')
        setMessagesMap((messagesMap) => {
          messagesMap.delete('4')

          return new Map(messagesMap)
        })
        setMessagesMap((messagesMap) => {
          messagesMap.set('4', temporary!)

          return new Map(messagesMap)
        })
       
      }}>Click</button>
      {array.map((data) => {
      return <MessageComponent key={data.id} str={data.str} id={data.id} />
    })}
    </div>
}