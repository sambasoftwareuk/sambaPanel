"use client";

import { useState } from "react";
import {
  CourseTagButton,
  DirectionButton,
  IconOnlyButton,
  OutlinedButton,
  PrimaryButton,
  OutlinedButtonWithIcon,
} from "../_atoms/buttons";
import { Header1, Header2, Header3 } from "../_atoms/Headers";
import Icon from "../_atoms/Icon";
import {
  Cart,
  Search,
  Globe,
  Star,
  HalfStar,
  PremiumBadge,
  LineRightArrow,
  ChevronRight,
  ChevronLeft,
} from "../_atoms/Icons";
import {
  CardImage,
  LogoImage,
  ProfileImage,
  SliderImage,
} from "../_atoms/images";
import {
  InputBasic,
  InputBasicWithIcon,
  InputWithClickableIcon,
  InputWithIconStart,
} from "../_atoms/inputs";
import { LabelPrimary, LabelSecondary } from "../_atoms/labels";
import { SambaLinks } from "../_atoms/SambaLinks";
import { ShowMoreButton } from "../_atoms/showMoreButton";
import { Checkbox } from "../_atoms/checkbox";
import Breadcrumb from "../_molecules/breadCrumb";

const page = () => {
  const [showAll, setShowAll] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="p-4">
      <Breadcrumb />
      <div className="flex flex-wrap gap-2">
        <Icon variant={Cart} size={32} color="text-primary900" />
        <Icon variant={Search} size={32} color="text-sunshine" />
        <Icon variant={Globe} size={32} color="text-secondary" />
        <Icon variant={Star} size={32} color="text-secondary200" />
        <Icon variant={HalfStar} size={32} color="text-red" />
      </div>
      <Icon variant={Cart} size={32} color="text-primary900" />
      <Icon variant={Search} size={32} color="text-sunshine" />
      <Icon variant={Globe} size={32} color="text-secondary" />
      <Icon variant={Star} size={32} color="text-secondary200" />
      <Icon variant={HalfStar} size={32} color="text-red" />
      <Icon variant={PremiumBadge} size={32} color="text-primary" />
      <Icon variant={LineRightArrow} size={32} color="text-primary" />
      <Icon variant={ChevronRight} size={32} color="text-primary" />
      <Icon variant={ChevronLeft} size={32} color="text-primary" />

      <div className="py-4 px-3 space-y-4">
        Empower Project
        <InputBasic placeholder="What do you want to learn?" />
        <InputBasicWithIcon placeholder="Search..." icon={Search} />
        <InputWithClickableIcon
          placeholder="Search..."
          icon={Search}
          onIconClick={() => console.log("click")}
        />
        <InputWithIconStart placeholder="Search..." icon={Search} />
      </div>
      <div className="flex flex-wrap gap-2">
        <PrimaryButton label="Login" />
        <OutlinedButton label="Register" />
        <IconOnlyButton icon={<Cart />} />
        <OutlinedButtonWithIcon icon={<Globe />} />
        <CourseTagButton label="Natural Language Processing (NLP)" active />
        <CourseTagButton label="Machine Learning" active={false} />
        <DirectionButton icon=">" />
        <DirectionButton icon="<" />
      </div>
      <div className="my-4">
        <SliderImage
          imageLink="/sampleimages/learner-centered.jpg"
          imageAlt="samba"
        />
      </div>
      <div className="my-4">
        <SliderImage />
      </div>
      <div>
        <CardImage imageLink="/sampleimages/learner-centered.jpg" />
      </div>
      <div>
        <CardImage />
      </div>
      <div>
        <LogoImage imageLink="/empower-logo.png" width={200} height={80} />
      </div>
      <div>
        <LogoImage width={200} height={80} />
      </div>
      <div>
        <ProfileImage imageLink="/sampleimages/man.png" />
      </div>
      <div>
        <ProfileImage />
      </div>

      <div className="font-serif text-3xl">
        Hello World, merriweather font is working!
      </div>
      <div className="font-mono text-3xl">
        Hello World, merriweather font is working!
      </div>

      <div className="flex flex-wrap gap-2 my-4">
        <LabelPrimary icon={PremiumBadge}>Premium</LabelPrimary>
        <LabelSecondary>Bestseller</LabelSecondary>
      </div>

      <div>
        <Header1>Header Samples (This is Header1)</Header1>
        <Header1 className="text-red text-6xl">
          Header Samples (This is Header1)
        </Header1>

        <Header2>This is Header2</Header2>
        <Header3>This is Header3</Header3>
      </div>
      <div className="flex flex-col gap-2 my-4 ">
        <SambaLinks className="bg-primary" color="white" underline="none">
          color changing with hover
        </SambaLinks>
        <SambaLinks color="primary900" underline="always">
          always underline
        </SambaLinks>
        <SambaLinks color="black" underline="none">
          none underline
        </SambaLinks>
        <SambaLinks color="black" underline="hover">
          underline with hover
        </SambaLinks>
      </div>
      <div>
        <ShowMoreButton
          showAll={showAll}
          hiddenCount={5}
          onClick={() => setShowAll(!showAll)}
        />
      </div>
      <div className="p-4">
        <Checkbox
          id="chatgpt"
          label="ChatGPT"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
        />
      </div>
    </div>
  );
};

export default page;
