// 存储收集的词句
let collectedPhrases = [];
let floatingWindow = null;
let isEnabled = false; // 插件开关状态

// 初始化:从storage加载已保存的词句和开关状态
chrome.storage.local.get(['phrases', 'isEnabled'], function(result) {
  if (result.phrases) {
    collectedPhrases = result.phrases;
    console.log('Loaded phrases:', collectedPhrases.length);
  }
  // 默认关闭，需要用户手动开启
  isEnabled = result.isEnabled === true;
  console.log('Extension enabled:', isEnabled);
  
  // 如果已启用且有收集的词句，显示提示
  if (isEnabled && collectedPhrases.length > 0) {
    showToast(`📝 插件已启用，已有 ${collectedPhrases.length} 条收集`);
  }
});

// 监听文本选择事件
document.addEventListener('mouseup', function(e) {
  // 检查插件是否启用
  if (!isEnabled) {
    return;
  }
  
  // 避免在浮窗内选择文本时触发
  if (e.target.closest('.word-collector-float')) {
    return;
  }
  
  // 延迟一点获取选中文本，确保选择完成
  setTimeout(function() {
    const selectedText = window.getSelection().toString().trim();
    
    console.log('Selected text:', selectedText); // 调试信息
    
    if (selectedText.length > 0) {
      // 高亮选中的文本
      highlightSelection();
      
      // 添加到收集列表
      addPhrase(selectedText, window.location.href);
      
      // 强制显示浮窗
      console.log('About to show floating window...');
      showFloatingWindow();
      
      // 显示简短的提示
      showToast('✅ 已收集: ' + selectedText.substring(0, 30) + (selectedText.length > 30 ? '...' : ''));
    }
  }, 10);
});

// 高亮选中的文本
function highlightSelection() {
  const selection = window.getSelection();
  if (selection.rangeCount === 0) return;
  
  try {
    const range = selection.getRangeAt(0);
    
    // 检查是否在可编辑区域
    const container = range.commonAncestorContainer;
    const parentElement = container.nodeType === 3 ? container.parentElement : container;
    
    // 避免在特殊元素中高亮
    if (parentElement.closest('input, textarea, [contenteditable="true"], .word-collector-float')) {
      return;
    }
    
    // 创建高亮元素
    const highlight = document.createElement('span');
    highlight.className = 'word-collector-highlight';
    
    // 尝试包裹选中的内容
    try {
      range.surroundContents(highlight);
    } catch (e) {
      // 如果选择跨越了多个元素，使用替代方法
      try {
        const fragment = range.extractContents();
        highlight.appendChild(fragment);
        range.insertNode(highlight);
      } catch (err) {
        console.log('Cannot highlight complex selection:', err);
      }
    }
  } catch (error) {
    console.log('Highlight error:', error);
  } finally {
    // 清除选择
    selection.removeAllRanges();
  }
}

// 添加词句到收集列表
function addPhrase(text, url) {
  const phrase = {
    id: Date.now(),
    text: text,
    url: url,
    timestamp: new Date().toISOString()
  };
  
  collectedPhrases.unshift(phrase); // 添加到开头
  
  // 保存到chrome.storage
  chrome.storage.local.set({ phrases: collectedPhrases });
}

// 显示浮窗
function showFloatingWindow() {
  console.log('showFloatingWindow called');
  console.log('floatingWindow exists:', !!floatingWindow);
  console.log('collectedPhrases length:', collectedPhrases.length);
  
  if (!floatingWindow) {
    console.log('Creating new floating window...');
    createFloatingWindow();
  }
  
  // 确保浮窗已添加到 DOM
  if (!document.body.contains(floatingWindow)) {
    console.log('Floating window not in DOM, adding...');
    document.body.appendChild(floatingWindow);
  }
  
  // 强制显示
  floatingWindow.style.display = 'block';
  floatingWindow.style.opacity = '1';
  floatingWindow.style.visibility = 'visible';
  
  console.log('Updating content...');
  updateFloatingWindowContent();
  
  console.log('Floating window should now be visible');
}

// 创建浮窗
function createFloatingWindow() {
  console.log('Creating floating window...');
  
  // 如果已存在，先移除
  if (floatingWindow) {
    floatingWindow.remove();
  }
  
  floatingWindow = document.createElement('div');
  floatingWindow.className = 'word-collector-float';
  
  // 设置初始样式确保可见
  floatingWindow.style.cssText = `
    position: fixed !important;
    top: 60px !important;
    right: 20px !important;
    width: 380px !important;
    max-height: 500px !important;
    background: white !important;
    border-radius: 12px !important;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15) !important;
    z-index: 2147483647 !important;
    display: block !important;
    opacity: 1 !important;
    visibility: visible !important;
  `;
  
  floatingWindow.innerHTML = `
    <div class="wc-header">
      <span class="wc-title">📝 收集的词句 (0)</span>
      <div class="wc-actions">
        <button class="wc-btn wc-btn-export" title="复制到剪贴板">📋</button>
        <button class="wc-btn wc-btn-clear" title="清空">🗑️</button>
        <button class="wc-btn wc-btn-minimize" title="最小化">➖</button>
        <button class="wc-btn wc-btn-close" title="关闭">✖️</button>
      </div>
    </div>
    <div class="wc-content">
      <div class="wc-list"></div>
    </div>
  `;
  
  // 立即添加到页面
  document.body.appendChild(floatingWindow);
  console.log('Floating window added to body');
  
  // 绑定事件
  const closeBtn = floatingWindow.querySelector('.wc-btn-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      floatingWindow.style.display = 'none';
    });
  }
  
  const minimizeBtn = floatingWindow.querySelector('.wc-btn-minimize');
  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', function() {
      floatingWindow.classList.toggle('minimized');
    });
  }
  
  const clearBtn = floatingWindow.querySelector('.wc-btn-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (confirm('确定要清空所有收集的词句吗?')) {
        clearAllPhrases();
      }
    });
  }
  
  const exportBtn = floatingWindow.querySelector('.wc-btn-export');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      exportPhrases();
    });
  }
  
  // 使浮窗可拖动
  makeDraggable(floatingWindow);
  
  console.log('Floating window created successfully');
}

// 更新浮窗内容
function updateFloatingWindowContent() {
  if (!floatingWindow) return;
  
  const listContainer = floatingWindow.querySelector('.wc-list');
  const titleSpan = floatingWindow.querySelector('.wc-title');
  
  // 检查元素是否存在
  if (!listContainer || !titleSpan) {
    console.error('Floating window elements not found');
    return;
  }
  
  titleSpan.textContent = `📝 收集的词句 (${collectedPhrases.length})`;
  
  if (collectedPhrases.length === 0) {
    listContainer.innerHTML = '<div class="wc-empty">暂无收集的词句<br>划选文本即可开始收集</div>';
    return;
  }
  
  listContainer.innerHTML = collectedPhrases.map((phrase, index) => `
    <div class="wc-item" data-id="${phrase.id}">
      <div class="wc-item-text">${escapeHtml(phrase.text)}</div>
      <div class="wc-item-meta">
        <span class="wc-item-time">${formatTime(phrase.timestamp)}</span>
        <button class="wc-item-delete" data-id="${phrase.id}">删除</button>
      </div>
    </div>
  `).join('');
  
  // 绑定删除按钮事件
  listContainer.querySelectorAll('.wc-item-delete').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const id = parseInt(this.getAttribute('data-id'));
      deletePhrase(id);
    });
  });
}

// 删除单个词句
function deletePhrase(id) {
  collectedPhrases = collectedPhrases.filter(p => p.id !== id);
  chrome.storage.local.set({ phrases: collectedPhrases });
  updateFloatingWindowContent();
}

// 清空所有词句
function clearAllPhrases() {
  // 清空内存中的数据
  collectedPhrases = [];
  
  // 清空存储
  chrome.storage.local.set({ phrases: [] }, function() {
    console.log('Storage cleared');
  });
  
  // 移除所有高亮
  document.querySelectorAll('.word-collector-highlight').forEach(el => {
    const parent = el.parentNode;
    if (parent) {
      while (el.firstChild) {
        parent.insertBefore(el.firstChild, el);
      }
      parent.removeChild(el);
    }
  });
  
  // 更新浮窗显示
  if (floatingWindow) {
    updateFloatingWindowContent();
  }
  
  showToast('✅ 已清空所有收集');
}

// 导出词句 - 复制到剪贴板
function exportPhrases() {
  if (collectedPhrases.length === 0) {
    showToast('❌ 没有可导出的内容');
    return;
  }
  
  const text = collectedPhrases.map((phrase, index) => {
    return `${index + 1}. ${phrase.text}\n来源: ${phrase.url}\n时间: ${new Date(phrase.timestamp).toLocaleString('zh-CN')}\n`;
  }).join('\n---\n\n');
  
  // 复制到剪贴板
  navigator.clipboard.writeText(text).then(() => {
    showToast(`✅ 已复制 ${collectedPhrases.length} 条词句到剪贴板！`);
  }).catch(err => {
    // 如果新API失败，使用旧方法
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`✅ 已复制 ${collectedPhrases.length} 条词句到剪贴板！`);
    } catch (err) {
      showToast('❌ 复制失败: ' + err.message);
    }
    document.body.removeChild(textArea);
  });
}

// 使元素可拖动
function makeDraggable(element) {
  const header = element.querySelector('.wc-header');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  
  header.addEventListener('mousedown', function(e) {
    if (e.target.closest('.wc-btn')) return; // 不在按钮上拖动
    
    isDragging = true;
    initialX = e.clientX - element.offsetLeft;
    initialY = e.clientY - element.offsetTop;
    header.style.cursor = 'grabbing';
  });
  
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      
      element.style.left = currentX + 'px';
      element.style.top = currentY + 'px';
      element.style.right = 'auto';
    }
  });
  
  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      header.style.cursor = 'grab';
    }
  });
}

// 工具函数:转义HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 工具函数:格式化时间
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
  
  return date.toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// 监听来自popup的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'showWindow') {
    if (isEnabled) {
      showFloatingWindow();
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, message: '插件未启用' });
    }
  } else if (request.action === 'getPhrases') {
    sendResponse({ phrases: collectedPhrases });
  } else if (request.action === 'clearHighlights') {
    // 清除所有高亮
    document.querySelectorAll('.word-collector-highlight').forEach(el => {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    });
    sendResponse({ success: true });
  } else if (request.action === 'toggleExtension') {
    // 切换插件开关状态
    isEnabled = request.enabled;
    chrome.storage.local.set({ isEnabled: isEnabled });
    
    if (isEnabled) {
      showToast('✅ 插件已启用，可以开始划词收集');
    } else {
      showToast('⏸️ 插件已关闭');
      // 关闭时隐藏浮窗
      if (floatingWindow) {
        floatingWindow.style.display = 'none';
      }
    }
    sendResponse({ success: true, enabled: isEnabled });
  } else if (request.action === 'getStatus') {
    // 获取插件状态
    sendResponse({ enabled: isEnabled, count: collectedPhrases.length });
  }
  return true; // 保持消息通道开放
});

// 显示Toast提示
function showToast(message) {
  // 移除已存在的toast
  const existingToast = document.querySelector('.wc-toast');
  if (existingToast) {
    existingToast.remove();
  }
  
  const toast = document.createElement('div');
  toast.className = 'wc-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  
  // 触发动画
  setTimeout(() => toast.classList.add('show'), 10);
  
  // 3秒后移除
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// 页面加载完成后的初始化
console.log('Word Collector Extension loaded successfully!');
