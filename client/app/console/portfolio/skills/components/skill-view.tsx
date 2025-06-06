"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "stores/auth";
import { PortfolioSkillsTypes } from "@/constants/supabase";
import { getSkills } from "services/skills";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, Plus } from "lucide-react";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SkillForm from "./skill-form";
import SkillCard from "./skill-card";
import SkillSkeleton from "@/components/ui/skill-skeleton";

const SkillView = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user_id } = useAuthStore((state) => state);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["skills", user_id],
    queryFn: () => getSkills(user_id, PortfolioSkillsTypes.skill),
    enabled: !!user_id,
  });

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleCancel = () => {
    setIsAddModalOpen(false);
  };

  if (isLoading) {
    return <SkillSkeleton />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>
          <SkillForm onCancel={handleCancel} skillLength={skills?.length || 0} />
        </DialogContent>
      </Dialog>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {skills?.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
      {skills?.length === 0 && !isLoading && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No skills entries yet</AlertTitle>
          <AlertDescription>Add your skills to show clients what you are good at.</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SkillView;
