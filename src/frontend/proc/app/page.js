import Image from "next/image";

export default function Home() {
  return (
    <main>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome!!
        </p>
      </div>

      <div>
        <br />
        <p>
          <b>Proc Application</b>
        </p>
        <p>
          The purpose of this application is to show data relating to car sales.
        </p>
        <br />
        <hr />
        <h3>Alunos:</h3>
        <p className={"italic"}>Diogo Bernardes Rafael André Sérgio Barbosa</p>
        <hr />
        <hr />
        <h3>Docentes:</h3>
        <p className={"italic"}>Luís Teófilo & Jorge Ribeiro</p>
      </div>
    </main>
  );
}
