import Image from "next/image"
import Link from "next/link"

const PostPage = () => {
    return (
        <div className="relative bg-slate-50 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-grid [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" style={{ backgroundPosition: "10px 10px" }}></div>
            <div className="relative rounded-xl overflow-auto">
                <div className="shadow-sm overflow-hidden my-8">
                    <table className="border-collapse table-auto w-full text-sm">
                        <thead>
                            <tr>
                                <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">ID</th>
                                <th className="border-b font-medium p-4 pl-8 pt-0 pb-3 text-slate-400 text-left">TITLE</th>
                                <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left">LINK</th>
                                <th className="border-b font-medium p-4 pr-8 pt-0 pb-3 text-slate-400 text-left">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            <tr>
                                <td className="border-b border-slate-10 p-4 pl-8 text-slate-500">1</td>
                                <td className="border-b border-slate-10 p-4 pl-8 text-slate-500">
                                    <div className="inline-flex items-center gap-3">
                                        <div className="grow-0 rounded-md bg-black/5 ring-1 ring-black/10 aspect-square w-20">
                                            <Image src={'/next.svg'} alt="post image" width={40} height={40} className="size-full object-cover" />
                                        </div>
                                        <div className="grow">
                                            <div>The Sliding Mr. Bones (Next Stop, Pottersville)</div>
                                            <div>Malcolm Lockyer</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-b border-slate-10 p-4 pr-8 text-slate-500">
                                    <a href="https://1024terabox.com/s/kldgioerjsj" target="_blank">https://1024terabox.com/s/kldgioerjsj</a>
                                </td>
                                <td className="border-b border-slate-10 p-4 pr-8 text-slate-500">
                                    <div className="relative flex gap-x-3 select-none">
                                        <div className="flex h-6 items-center">
                                            <input type="checkbox" id="offers" className="h-4 w-4 rounded border-gray-300 text-purple-700 focus:ring-purple-600" />
                                        </div>
                                        <div className="text-sm leading-6">
                                            <label htmlFor="offers" className="font-medium text-gray-900">Active</label>
                                        </div>
                                    </div>
                                </td>
                                <td className="border-b border-slate-10 p-4 pr-8 text-slate-500">
                                    <div className="inline-flex gap-2">
                                        <Link href={'/admin'} aria-label="Edit" className="rounded-md bg-black/5 p-2 ring-1 ring-black/10"></Link>
                                        <Link href={'/admin'} aria-label="Delete" className="rounded-md bg-black/5 p-2 ring-1 ring-black/10"></Link>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none border border-black/5 rounded-xl"></div>
        </div>
    )
}

export default PostPage