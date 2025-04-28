import React, { useEffect, useState } from "react";
import { supabase } from "../../../utils/supabase";
import { BackLogo } from "../../components/Logos";

function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  const searchForMatch = async () => {
    try {
      const constantSearchTerm = searchTerm.toLowerCase();
      const { data, error } = await supabase.rpc("search_substitutions", {
        search_term: constantSearchTerm,
      });

      if (error) {
        console.error("Error calling the function:", error);
        setResults({ error: "Error fetching data" });
      } else {
        if (data) {
          const updated = updateMatchedFields(data, constantSearchTerm);
          setResults(updated);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setResults({ error: "Error fetching data" });
    }
  };

  const updateMatchedFields = (data, searchTerm) => {
    if (!data || data.length === 0) return [];

    return data.map((sub) => {
      const importantFields = [
        "teacher_name",
        "sub_teacher_name",
        "subject_name",
      ];

      const matchedFields = [];

      importantFields.forEach((key) => {
        // FIXED: use `${key}_match` here
        if (sub.matches && sub.matches[`${key}_match`] === true && sub[key]) {
          const value = sub[key];
          if (value.toLowerCase().includes(searchTerm)) {
            matchedFields.push({
              field: key,
              value: value,
            });
          }
        }
      });

      return { ...sub, matchedFields };
    });
  };

  return (
    <div className="fixed h-[100dvh] w-[100vw] bg-backgroundc">
      <div className="h-[10dvh] w-full text-textc flex flex-row items-center gap-[10px] px-[min(3vw,50px)]">
        <BackLogo size="min(3rem,50px)" />
        <span className="text-heading font-bold">Search</span>
      </div>
      <div className="p-[min(3vw,50px)]">
        <div className="bg-textc p-[min(2vw,30px)] rounded-md w-[clamp(300px,100%,700px)]">
          <input
            type="text"
            className="bg-textc outline-none w-[100%]"
            placeholder="Enter to search"
          ></input>
        </div>
      </div>
      <input
        type="text"
        placeholder="Enter text"
        className="text-textc"
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
      ></input>
      <button onClick={() => searchForMatch()} className="text-textc">
        Search
      </button>
      <div className="flex flex-col gap-[10px] p-[min(3vw,50px)]">
        {results && results.length > 0
          ? results.map((sub, index) => (
              <div key={index} className="bg-backgroundh rounded-md">
                <div className="p-[min(3vw,30px)] flex flex-row bg-textc text-backgroundc rounded-md">
                  <div className="flex flex-col flex-1/2 justify-between">
                    <span>{sub.subject_name}</span>
                    <div className="flex flex-row text-[min(1rem,10px)]">
                      <span>{sub.teacher_name}</span>
                      <span>{" -> "}</span>
                      <span>{sub.sub_teacher_name}</span>
                    </div>
                  </div>
                  <div className="flex-1/2 flex flex-col items-end">
                    <span>{sub.created_at.split("T")[0]}</span>
                    <div className="flex flex-row text-[min(1rem,10px)]">
                      <span>{sub.state}</span>
                    </div>
                  </div>
                </div>

                {/* matched fields below */}
                {sub.matchedFields && sub.matchedFields.length > 0 && (
                  <div className="p-[min(2vw,20px)] text-textc text-[min(1rem,10px)] flex flex-col gap-[5px]">
                    {sub.matchedFields.map((match, matchIndex) => (
                      <div key={matchIndex}>
                        <span className="text-accentc">
                          Matched {match.field}:{" "}
                        </span>
                        <span>{match.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default SearchPage;
