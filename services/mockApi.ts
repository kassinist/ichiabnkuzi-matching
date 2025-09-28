
import type { InventoryItem, SearchFilters, SortOption, PrizeGrade } from '../types';

const samplePrizes = [
    { id: 'p1', title: 'モンキー・D・ルフィ フィギュア ギア5', series: 'ワンピース 一番くじ Emotional Stories 2', grade: 'A' as PrizeGrade },
    { id: 'p2', title: 'トラファルガー・ロー フィギュア', series: 'ワンピース 一番くじ Emotional Stories 2', grade: 'B' as PrizeGrade },
    { id: 'p3', title: 'ラストワン賞 スペシャルルフィフィギュア', series: 'ワンピース 一番くじ Emotional Stories 2', grade: 'Last One' as PrizeGrade },
    { id: 'p4', title: '五条悟 フィギュア 渋谷事変', series: '呪術廻戦 一番くじ 渋谷事変編', grade: 'A' as PrizeGrade },
    { id: 'p5', title: '夏油傑 フィギュア 渋谷事変', series: '呪術廻戦 一番くじ 渋谷事変編', grade: 'B' as PrizeGrade },
    { id: 'p6', title: '竈門炭治郎 フィギュア', series: '鬼滅の刃 一番くじ 刀鍛冶の里編', grade: 'A' as PrizeGrade },
    { id: 'p7', title: '竈門禰豆子 フィギュア', series: '鬼滅の刃 一番くじ 刀鍛冶の里編', grade: 'B' as PrizeGrade },
    { id: 'p8', title: 'ビッグタオルコレクション', series: '呪術廻戦 一番くじ 渋谷事変編', grade: 'C' as PrizeGrade },
    { id: 'p9', title: 'アクリルスタンドセット', series: 'ワンピース 一番くじ Emotional Stories 2', grade: 'D' as PrizeGrade },
    { id: 'p10', title: 'ラバーチャームコレクション', series: '鬼滅の刃 一番くじ 刀鍛冶の里編', grade: 'E' as PrizeGrade }
];

const sampleStores = [
    { id: 's1', name: 'ホビーショップ秋葉原本店', address: '東京都千代田区外神田1-1-1', distanceKm: 1.2, rating: 4.8, verified: true },
    { id: 's2', name: 'セブン-イレブン池袋東口店', address: '東京都豊島区東池袋3-3-3', distanceKm: 3.5, rating: 4.2, verified: false },
    { id: 's3', name: 'ブックオフ新宿西口店', address: '東京都新宿区西新宿1-2-3', distanceKm: 8.1, rating: 4.5, verified: true },
    { id: 's4', name: 'トイプラネット中野店', address: '東京都中野区中野5-52-15', distanceKm: 5.5, rating: 4.9, verified: true },
    { id: 's5', name: 'ファミリーマート渋谷駅前店', address: '東京都渋谷区道玄坂2-1-1', distanceKm: 12.3, rating: 4.0, verified: false },
];

const mockInventory: InventoryItem[] = [
    { id: 'inv1', store: sampleStores[0], prize: samplePrizes[0], quantity: 1, price: 4500, photos: ['https://picsum.photos/seed/inv1/600/400'], status: 'public', registeredAt: new Date('2023-10-26T10:00:00Z') },
    { id: 'inv2', store: sampleStores[1], prize: samplePrizes[3], quantity: 2, price: 5200, photos: ['https://picsum.photos/seed/inv2/600/400'], status: 'public', registeredAt: new Date('2023-10-25T14:00:00Z') },
    { id: 'inv3', store: sampleStores[2], prize: samplePrizes[2], quantity: 1, price: 8800, photos: ['https://picsum.photos/seed/inv3/600/400'], status: 'public', registeredAt: new Date('2023-10-26T12:00:00Z') },
    { id: 'inv4', store: sampleStores[3], prize: samplePrizes[1], quantity: 3, price: 3200, photos: ['https://picsum.photos/seed/inv4/600/400'], status: 'public', registeredAt: new Date('2023-10-20T09:00:00Z') },
    { id: 'inv5', store: sampleStores[0], prize: samplePrizes[4], quantity: 1, price: 3800, photos: ['https://picsum.photos/seed/inv5/600/400'], status: 'public', registeredAt: new Date('2023-10-26T11:00:00Z') },
    { id: 'inv6', store: sampleStores[4], prize: samplePrizes[5], quantity: 2, price: 4200, photos: ['https://picsum.photos/seed/inv6/600/400'], status: 'public', registeredAt: new Date('2023-10-24T18:00:00Z') },
    { id: 'inv7', store: sampleStores[1], prize: samplePrizes[8], quantity: 10, price: 1200, photos: ['https://picsum.photos/seed/inv7/600/400'], status: 'public', registeredAt: new Date('2023-10-15T10:00:00Z') },
    { id: 'inv8', store: sampleStores[3], prize: samplePrizes[6], quantity: 1, price: 4800, photos: ['https://picsum.photos/seed/inv8/600/400'], status: 'public', registeredAt: new Date('2023-10-26T08:00:00Z') },
    { id: 'inv9', store: sampleStores[2], prize: samplePrizes[7], quantity: 5, price: 1500, photos: ['https://picsum.photos/seed/inv9/600/400'], status: 'public', registeredAt: new Date('2023-10-22T13:00:00Z') },
    { id: 'inv10', store: sampleStores[4], prize: samplePrizes[9], quantity: 8, price: 900, photos: ['https://picsum.photos/seed/inv10/600/400'], status: 'public', registeredAt: new Date('2023-10-23T16:00:00Z') },
];

const calculateScore = (item: InventoryItem, maxDistance: number): number => {
    // Weights from spec
    const w = { w1: 0.35, w2: 0.25, w3: 0.2, w4: 0.15, w5: 0.05 };
    
    // 1. Distance Score (0-1, higher is better/closer)
    const distanceScore = Math.max(0, 1 - (item.store.distanceKm / maxDistance));

    // 2. Rarity Score (0-1)
    let rarityScore = 0;
    if (item.prize.grade === 'Last One') rarityScore = 1.0;
    else if (item.prize.grade === 'A') rarityScore = 0.9;
    else if (item.prize.grade === 'B') rarityScore = 0.7;
    else if (item.prize.grade === 'C') rarityScore = 0.5;
    else rarityScore = 0.3;
    if (item.quantity === 1) rarityScore = Math.min(1.0, rarityScore + 0.2); // Bonus for low stock

    // 3. Price Score (assuming max price is around $100 for this normalization)
    const priceScore = Math.max(0, 1 - (item.price / 100));
    
    // 4. Freshness Score (0-1, newer is better)
    const hoursSinceRegistered = (new Date().getTime() - item.registeredAt.getTime()) / (1000 * 60 * 60);
    const freshnessScore = Math.max(0, 1 - (hoursSinceRegistered / (7 * 24))); // Max freshness within 7 days
    
    // 5. Review Score (normalized from 1-5 to 0-1)
    const reviewScore = (item.store.rating - 1) / 4;

    const totalScore = 
        w.w1 * distanceScore + 
        w.w2 * rarityScore + 
        w.w3 * priceScore + 
        w.w4 * freshnessScore + 
        w.w5 * reviewScore;

    return totalScore;
};

export const searchInventory = (filters: SearchFilters, sort: SortOption): Promise<InventoryItem[]> => {
    console.log('検索条件:', filters, '並び順:', sort);
    return new Promise((resolve) => {
        setTimeout(() => {
            let results = mockInventory.filter(item => item.status === 'public');

            // Apply filters
            if (filters.query) {
                const lowerCaseQuery = filters.query.toLowerCase();
                results = results.filter(item => 
                    item.prize.title.toLowerCase().includes(lowerCaseQuery) ||
                    item.prize.series.toLowerCase().includes(lowerCaseQuery)
                );
            }
            results = results.filter(item => item.store.distanceKm <= filters.radius);
            if (filters.prizeGrade !== 'all') {
                results = results.filter(item => item.prize.grade === filters.prizeGrade);
            }

            // Calculate scores for all items
            results.forEach(item => {
                item.score = calculateScore(item, filters.radius);
            });

            // Apply sorting
            switch (sort) {
                case 'score':
                    results.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
                    break;
                case 'distance':
                    results.sort((a, b) => a.store.distanceKm - b.store.distanceKm);
                    break;
                case 'price':
                    results.sort((a, b) => a.price - b.price);
                    break;
                case 'newest':
                    results.sort((a, b) => b.registeredAt.getTime() - a.registeredAt.getTime());
                    break;
            }

            resolve(results);
        }, 800); // Simulate network latency
    });
};

