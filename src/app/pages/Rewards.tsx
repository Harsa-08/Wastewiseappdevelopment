import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Gift, Award, TrendingUp, Ticket } from 'lucide-react';
import { authStorage, userStorage, rewardsStorage } from '../services/storage';
import { User, Reward, UserReward } from '../types';
import { mockRewards } from '../services/mockData';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Rewards() {
  const [user, setUser] = useState<User | null>(null);
  const [myRewards, setMyRewards] = useState<UserReward[]>([]);

  useEffect(() => {
    const currentUser = authStorage.getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setMyRewards(rewardsStorage.getUserRewards(currentUser.id));
    }
  }, []);

  const handleRedeem = (reward: Reward) => {
    if (!user) return;

    if (user.credits < reward.creditsRequired) {
      toast.error(`You need ${reward.creditsRequired - user.credits} more credits`);
      return;
    }

    const userReward = rewardsStorage.redeemReward(user.id, reward);
    userStorage.updateUser(user.id, {
      credits: user.credits - reward.creditsRequired
    });

    setUser({ ...user, credits: user.credits - reward.creditsRequired });
    setMyRewards([...myRewards, userReward]);
    toast.success(`Redeemed! Code: ${userReward.code}`);
  };

  if (!user) return null;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'voucher': return <Gift className="h-5 w-5" />;
      case 'discount': return <Ticket className="h-5 w-5" />;
      case 'coupon': return <Award className="h-5 w-5" />;
      case 'cashback': return <TrendingUp className="h-5 w-5" />;
      default: return <Gift className="h-5 w-5" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl">Rewards</h1>
        <p className="text-muted-foreground">Redeem your credits for amazing rewards</p>
      </div>

      <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Your Credits</p>
              <p className="text-4xl">{user.credits}</p>
            </div>
            <Award className="h-16 w-16 opacity-50" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Level {user.level}</span>
              <span>Level {user.level + 1}</span>
            </div>
            <Progress value={(user.credits % 1000) / 10} className="h-2 bg-primary-foreground/30" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="available">
        <TabsList>
          <TabsTrigger value="available">Available Rewards</TabsTrigger>
          <TabsTrigger value="redeemed">My Rewards ({myRewards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockRewards.map((reward) => {
              const canAfford = user.credits >= reward.creditsRequired;
              const progress = Math.min((user.credits / reward.creditsRequired) * 100, 100);

              return (
                <Card key={reward.id} className={!canAfford ? 'opacity-60' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(reward.category)}
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {reward.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{reward.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Credits needed</span>
                        <span className="font-semibold">{reward.creditsRequired}</span>
                      </div>
                      {!canAfford && (
                        <>
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {reward.creditsRequired - user.credits} more credits needed
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Value: {reward.value}</span>
                      <span>{reward.maxRedemptions - reward.redemptionCount} left</span>
                    </div>

                    <Button 
                      className="w-full"
                      disabled={!canAfford}
                      onClick={() => handleRedeem(reward)}
                    >
                      {canAfford ? 'Redeem Now' : 'Need More Credits'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="redeemed" className="space-y-4 mt-4">
          {myRewards.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Gift className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No rewards redeemed yet</p>
                <Button className="mt-4" onClick={() => {}}>
                  Browse Rewards
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRewards.map((userReward) => (
                <Card key={userReward.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{userReward.reward.title}</CardTitle>
                      <Badge variant={userReward.used ? 'secondary' : 'default'}>
                        {userReward.used ? 'Used' : 'Active'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs text-muted-foreground mb-1">Redemption Code</p>
                      <p className="text-xl tracking-wider">{userReward.code}</p>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Redeemed: {new Date(userReward.redeemedAt).toLocaleDateString()}</p>
                      <p>Valid until: {new Date(userReward.reward.validUntil).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
