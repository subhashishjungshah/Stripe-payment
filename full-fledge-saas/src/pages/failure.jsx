export default function cancel() {
  return (
    <>
      <div className="m-0 min-h-screen bg-[#FDFDFD] p-0">
        <div className="flex min-h-[80vh] w-full flex-col items-center justify-center">
          <div className="mx-auto my-10 flex flex-col items-center justify-center text-2xl text-red-600">
            <img
              src="https://png.pngtree.com/png-clipart/20190619/original/pngtree-vector-cancel-icon-png-image_3991605.jpg"
              alt="cancel"
              width={220}
              height={220}
              className="mix-blend-multiply"
            />
            <h3 className="pt-20 text-center text-4xl font-bold text-slate-700">
              Something Went Wrong
            </h3>
            <a
              href="/"
              className="my-16 w-auto rounded bg-slate-900 px-8 py-3 text-xl uppercase text-white"
            >
              Go To Homepage
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
