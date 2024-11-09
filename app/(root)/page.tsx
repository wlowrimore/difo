import SearchForm from "@/components/SearchForm";

export default async function Home() {
  const query = "";
  return (
    <>
      <section className="blue_container bg-swirl-pattern">
        <div className="heading">
          <h1 className="">DIY Projects made easy,</h1>
          <p className="">Thanks to your neighbors</p>
        </div>
        <div className="sub-heading">
          <h2>Find help. Save money. Support your community.</h2>
        </div>
        <SearchForm query={query} />
      </section>
    </>
  );
}
