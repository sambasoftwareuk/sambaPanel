"use client";

import React from "react";
import { Header1 } from "../_atoms/Headers";
import Breadcrumb from "../_molecules/breadCrumb";
import content from "../mocks/kurumsal.json";
import Image from "next/image";

const Kurumsal = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb />

        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto flex">
            <div>
              <Header1 className="text-primary mb-6">{content.title}</Header1>

              <div className="prose max-w-none">
                {content.content.map((html, index) => (
                  <div
                    key={index}
                    className="text-gray-700 leading-relaxed mb-6 last:mb-0"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                ))}
              </div>
            </div>
            <div 
            className="mt-16 w-5/6 ml-4"
            >
              <Image
                src={"/5.jpg"}
                alt={content.title}
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kurumsal;
