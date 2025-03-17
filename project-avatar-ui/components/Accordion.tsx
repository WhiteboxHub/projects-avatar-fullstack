// // new-projects-avatar-fullstack/project-avatar-ui/components/Accordion.tsx

// import React, { useState } from 'react';

// interface AccordionProps {
//   header: React.ReactNode;
//   children: React.ReactNode;
// }

// const Accordion: React.FC<AccordionProps> = ({ header, children }) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleAccordion = () => {
//     setIsOpen(!isOpen);
//   };

//   return (
//     <div className="accordion">
//       <div className="accordion-header" onClick={toggleAccordion}>
//         {header}
//       </div>
//       <div className={`accordion-content ${isOpen ? 'open' : 'closed'}`}>
//         {children}
//       </div>
//     </div>
//   );
// };

// export default Accordion;


import React, { useState } from 'react';

interface AccordionProps {
  header: React.ReactNode;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ header, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="accordion border border-gray-300 rounded-md mb-4">
      <div
        className="accordion-header p-4 bg-gray-200 cursor-pointer flex justify-between items-center"
        onClick={toggleAccordion}
      >
        {header}
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      <div className={`accordion-content ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  );
};

export default Accordion;
